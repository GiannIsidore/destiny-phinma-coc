import { useState } from 'react';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems: FAQItem[] = [
    {
      question: "What are the library hours?",
      answer: "The library is open Monday through Friday from 8:00 AM to 8:00 PM, and on Saturdays from 8:00 AM to 5:00 PM. The library is closed on Sundays and holidays."
    },
    {
      question: "How do I borrow books from the library?",
      answer: "To borrow books, you must present your valid PHINMA COC ID at the circulation desk. Undergraduate students may borrow up to 3 books for 7 days, while faculty members may borrow up to 5 books for 14 days."
    },
    {
      question: "Can I renew my borrowed books?",
      answer: "Yes, you can renew your borrowed books once, provided there are no holds on the items. Renewals can be done in person at the circulation desk or online through the library catalog."
    },
    {
      question: "What happens if I return a book late?",
      answer: "Overdue books incur a fine of ₱5.00 per day per book. Prolonged overdue items may result in a temporary suspension of borrowing privileges until the fine is paid."
    },
    {
      question: "How do I access the online resources?",
      answer: "Online resources can be accessed through the library's website using your student credentials. For off-campus access, use the remote access link provided on the library's homepage."
    },
    {
      question: "Can I reserve a study room?",
      answer: "Yes, group study rooms are available and can be reserved up to one week in advance. Reservations can be made in person at the library or through our online reservation system."
    },
    {
      question: "How do I request a book that is not in the library's collection?",
      answer: "You can submit an interlibrary loan request or suggest a purchase by filling out the 'Recommend a Book' form available on our website or at the reference desk."
    },
    {
      question: "Can alumni access the library?",
      answer: "Yes, alumni can access the library by presenting their alumni ID. However, borrowing privileges may be limited. Please inquire at the circulation desk for more information."
    },
    {
      question: "Is printing available in the library?",
      answer: "Yes, printing services are available at designated computer stations in the library. Black and white printing costs ₱2.00 per page, and color printing costs ₱10.00 per page."
    },
    {
      question: "How do I get help with research?",
      answer: "Reference librarians are available to assist with research questions during library hours. You can also schedule a one-on-one consultation or send your questions via email to library@phinmacoc.edu.ph."
    }
  ];

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
              {faqItems.map((faq, index) => (
                <div
                  key={index}
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

            <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
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
