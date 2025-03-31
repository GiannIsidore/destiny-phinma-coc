import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface Faq {
  id: number;
  question: string;
  answer: string;
}

export const FaqChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const API_URL = 'http://localhost/destiny-phinma-coc/api';

  const fetchFaqs = async () => {
    try {
      const response = await fetch(`${API_URL}/faq.php?operation=getFaqs`);
      const data = await response.json();
      if (data.status === 'success') {
        setFaqs(data.data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const handleQuestionClick = (faq: Faq) => {
    setLoading(true);
    setMessages(prev => [...prev,
      { text: faq.question, isUser: true },
    ]);

    // Simulate typing delay
    setTimeout(() => {
      setMessages(prev => [...prev,
        { text: faq.answer, isUser: false }
      ]);
      setLoading(false);
    }, 500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Ask VIRLA"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col z-50">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} />
          <h3 className="font-semibold">Ask VIRLA</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-blue-700 p-1 rounded"
        >
          <X size={20} />
        </button>
      </div>

      {/* Welcome Message */}
      {messages.length === 0 && (
        <div className="p-4 text-center text-gray-600">
          <p className="mb-2">👋 Hi! I'm VIRLA, your virtual library assistant.</p>
          <p>Pick a question below or reach out to us:</p>
          <div className="mt-2 text-sm">
            <p>📧 library.coc@phinmaed.com</p>
            <p>
              <a
                href="facebook.com/PHINMACOCLibrary"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                facebook.com/PHINMACOCLibrary
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
              VIRLA is typing...
            </div>
          </div>
        )}
      </div>

      {/* Question suggestions */}
      <div className="p-4 border-t">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">
          Frequently Asked Questions
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {faqs.map((faq) => (
            <button
              key={faq.id}
              onClick={() => handleQuestionClick(faq)}
              className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              {faq.question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
