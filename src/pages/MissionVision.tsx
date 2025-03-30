import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { motion } from 'framer-motion';

const MissionVision = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="relative flex-grow pt-24 pb-16">
        <div
          className="absolute inset-0 bg-[url('https://coc.phinma.edu.ph/wp-content/uploads/2024/03/PHINMA-COC-MAIN.jpg')] bg-fixed bg-center bg-no-repeat bg-cover filter blur-[8px]"
        />
        <div className="relative container mx-auto px-4" style={{ zIndex: 100 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-3xl font-bold mb-8 text-primary">Vision & Mission</h1>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-primary">Vision</h2>
                <p className="text-lg">
                  The Rosauro P. Dongallo Learning Resource Center envisions itself to be the premier academic information provider and knowledge repository in Northern Mindanao, committed to the development of the total person.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-primary">Mission</h2>
                <p className="text-lg">
                  The mission of the COC-PHINMA Education Network Library is to provide quality and updated information resources and user-centered services that will sustain the instructional, research and extension programs of the academic community.
                </p>
              </div>
            </div>

            <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-primary">Our Goals</h2>
              <ul className="list-disc pl-6 space-y-3 text-lg">
                <li>To build, organize, preserve and make accessible the library's collection.</li>
                <li>To provide relevant information resources in various formats to support the curriculum.</li>
                <li>To develop information literacy skills among users.</li>
                <li>To extend library services to the community.</li>
                <li>To establish linkages with other libraries and institutions.</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MissionVision;
