import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Pencil, Trash2, Plus, X, Link as LinkIcon } from 'lucide-react';
import { BASE_URL } from '../lib/config';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  links: string | null;
}

const AdminFaqPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    links: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}api/faq.php?operation=getFaqs`);
      const data = await response.json();
      if (data.status === 'success') {
        setFaqs(data.data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const operation = editingFaq ? 'updateFaq' : 'addFaq';
    const payload = {
      operation,
      json: {
        ...formData,
        links: formData.links || null,
        ...(editingFaq && { id: editingFaq.id })
      }
    };

    try {
      const response = await fetch(`${BASE_URL}api/faq.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.status === 'success') {
        toast.success(editingFaq ? 'FAQ updated successfully' : 'FAQ added successfully');
        fetchFaqs();
        handleCloseModal();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const response = await fetch(`${BASE_URL}api/faq.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'deleteFaq',
          json: { id }
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        toast.success('FAQ deleted successfully');
        fetchFaqs();
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      links: faq.links || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
    setFormData({ question: '', answer: '', links: '' });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">FAQ Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} /> Add FAQ
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-600 mb-2">{faq.answer}</p>
                {faq.links && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <LinkIcon size={16} />
                    <a href={faq.links} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                      {faq.links}
                    </a>
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(faq)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <LinkIcon size={20} className="text-gray-400" />
                  <input
                    type="text"
                    value={formData.links}
                    onChange={(e) => setFormData({ ...formData, links: e.target.value })}
                    placeholder="Enter URL or internal route (e.g., /library-services)"
                    className="flex-1 p-2 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingFaq ? 'Update' : 'Add'} FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFaqPage;
