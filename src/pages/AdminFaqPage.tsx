import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const AdminFaqPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });
  const baseUrl = 'http://localhost/destiny-phinma-coc/';

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch(`${baseUrl}api/faq.php?operation=getFaqs`);
      const data = await response.json();
      if (data.status === 'success') {
        setFaqs(data.data);
      }
    } catch {
      toast.error('Failed to fetch FAQs');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const operation = editingFaq ? 'updateFaq' : 'addFaq';
      const data = editingFaq
        ? {
            id: editingFaq.id,
            question: formData.question,
            answer: formData.answer
          }
        : formData;

      const formDataToSend = new FormData();
      formDataToSend.append('operation', operation);
      formDataToSend.append('json', JSON.stringify(data));

      const response = await fetch(`${baseUrl}api/faq.php`, {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();
      if (result.status === 'success') {
        toast.success(result.message);
        setIsModalOpen(false);
        setEditingFaq(null);
        setFormData({ question: '', answer: '' });
        fetchFaqs();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Failed to save FAQ');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        const formData = new FormData();
        formData.append('operation', 'deleteFaq');
        formData.append('json', JSON.stringify({ id }));

        const response = await fetch(`${baseUrl}api/faq.php`, {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (result.status === 'success') {
          toast.success(result.message);
          fetchFaqs();
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error('Failed to delete FAQ');
      }
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white p-6 mb-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">FAQ Management</h1>
        <button
          onClick={() => {
            setEditingFaq(null);
            setFormData({ question: '', answer: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2 rounded hover:bg-[#333333] transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add FAQ
        </button>
      </div>

      <div className="grid gap-4">
        {faqs.map((faq) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg p-4 hover:border-[#1a1a1a] transition-colors"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(faq)}
                  className="p-2 text-[#1a1a1a] hover:bg-gray-100 rounded transition-colors"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl"
          >
            <h2 className="text-xl font-semibold mb-6">
              {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, question: e.target.value }))
                  }
                  className="w-full p-3 border rounded focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] outline-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, answer: e.target.value }))
                  }
                  className="w-full p-3 border rounded focus:ring-1 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] outline-none"
                  rows={5}
                  required
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1a1a1a] text-white rounded hover:bg-[#333333] transition-colors"
                >
                  {editingFaq ? 'Update' : 'Add'} FAQ
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminFaqPage;
