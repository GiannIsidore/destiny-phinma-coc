import { useState, useEffect } from 'react';
import { Header } from '../components/header';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../lib/config';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  links: string | null;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

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

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const renderLink = (link: string) => {
    if (link.startsWith('/')) {
      return (
        <Link to={link} className="text-[#0d542b] hover:underline flex items-center gap-1">
          Learn more <ExternalLink size={16} />
        </Link>
      );
    }
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#0d542b] hover:underline flex items-center gap-1"
      >
        Learn more <ExternalLink size={16} />
      </a>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-3xl font-bold mb-8 text-primary">Frequently Asked Questions</h1>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 text-left text-lg font-medium focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-primary" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>

                  {openIndex === index && (
                    <div className="p-4 pt-0 text-gray-700 bg-gray-50">
                      <p className="mb-2">{faq.answer}</p>
                      {faq.links && renderLink(faq.links)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-20">
              <h2 className="text-xl font-bold mb-4 text-primary">Still Have Questions?</h2>
              <p className="mb-4">
                If you couldn't find the answer to your question, please feel free to contact us:
              </p>
              <ul className="space-y-2">
                <li><strong>Gmail:</strong> library.coc@phinmaed.com</li>
                <li><strong>Fb page:</strong><a href='https://facebook.com/PHINMACOCLibrary' target="_blank" rel="noopener noreferrer" className='hover:underline duration-300 transition-all hover:scale-125'> facebook.com/PHINMACOCLibrary</a></li>
                <li><strong>Fb account:</strong><a href='https://facebook.com/askvirla' target="_blank" rel="noopener noreferrer" className='hover:underline duration-300 transition-all hover:scale-125'> facebook.com/askvirla</a></li>
              </ul>
              {/*
              Gmail: library.coc@phinmaed.com
              Fb page: facebook.com/PHINMACOCLibrary
              Fb account: facebook.com/askvirla
              */}
            </div>
          </motion.div>
        </div>
      </main>

    </div>
  );
};

export default FAQ;
