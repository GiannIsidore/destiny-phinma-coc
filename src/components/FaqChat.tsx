import { useState, useEffect } from 'react';
import { MessageCircle, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../lib/config';

interface Faq {
  id: number;
  question: string;
  answer: string;
  links: string | null;
}

interface ChatMessage {
  text: string;
  isUser: boolean;
  link?: string;
}

export const FaqChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch(`${BASE_URL}api/faq.php?operation=getFaqs`);
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
        {
          text: faq.answer,
          isUser: false,
          link: faq.links || undefined
        }
      ]);
      setLoading(false);
    }, 500);
  };

  const handleLinkClick = (link: string) => {
    if (link.startsWith('/')) {
      navigate(link);
    } else {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] bg-[#0d542b] text-white p-4 rounded-full shadow-lg hover:bg-[#0a4121] transition-colors "
        title="Ask VIRLA"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col z-[9999]">
      {/* Header */}
      <div className="p-4 bg-[#0d542b] text-white rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} />
          <h3 className="font-semibold">Ask VIRLA</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-[#0a4121] p-1 rounded"
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
                href="https://facebook.com/PHINMACOCLibrary"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0d542b] hover:underline"
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
                  ? 'bg-[#0d542b] text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{message.text}</p>
              {!message.isUser && message.link && (
                <button
                  onClick={() => handleLinkClick(message.link!)}
                  className="mt-2 text-[#0d542b] hover:underline flex items-center gap-1 text-sm"
                >
                  Learn more <ExternalLink size={16} />
                </button>
              )}
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
              className="w-full text-left p-2 text-sm text-gray-700 hover:bg-[#0d542b] hover:text-white rounded transition-colors"
            >
              {faq.question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
