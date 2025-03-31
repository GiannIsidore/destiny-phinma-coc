import { useState, useEffect } from 'react';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
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

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-bold mb-4 text-primary">Still Have Questions?</h2>
              <p className="mb-4">
                If you couldn't find the answer to your question, please feel free to contact us:
              </p>
              <ul className="space-y-2">
                <li><strong>Email:</strong> library@phinmacoc.edu.ph</li>
                <li><strong>Phone:</strong> (088) 123-4567</li>
                <li><strong>Visit:</strong> The Reference Desk on the first floor of the library</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
