import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { motion } from 'framer-motion';

const LibraryServices = () => {
  return (
    <div className="flex flex-col min-h-screen" >
      <Header />

      <main className="relative flex-grow pt-24 pb-16  " >
        <div className="absolute inset-0" style={{
          backgroundImage: "url('https://coc.phinma.edu.ph/wp-content/uploads/2024/03/PHINMA-COC-MAIN.jpg')",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "blur(8px)",
          zIndex: -1
        }} />
        <div className="container mx-auto px-4 z-[9999] ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto z-[9999]"
          >
            <h1 className="text-5xl bg-secondary p-2 rounded font-bold mb-8 w-fit text-primary">Library Services</h1>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-primary bg-secondary p-2 w-fit shadow-2xl  rounded">UNIT LIBRARIES</h2>

              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl text-primary font-bold mb-4 ">Basic Education Library</h3>
                  <p className="text-primary-700">
                    The Library is located in the Main Campus, intended for the use of the elementary and high school Students. However, it is allowed that a college student may use the collection by asking permission from the School Librarian.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl text-primary font-bold mb-4 ">Puerto Campus Library</h3>
                  <p className="text-primary-700">
                    The library supports the information needs of the students, faculty and staff in the PHINMA-COC Puerto Campus. The use of the library is governed with rules and regulations that may differ from the Main Campus library.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-primary bg-secondary p-2 w-fit shadow-2xl  rounded">OTHER LIBRARY SERVICES</h2>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="mb-6 text-primary-700">
                  At COC-PEN Library, our students, administrators, faculty and staff members as well as other visiting researchers are our primary concerns. We are here to assist you in finding resources to meet your research, educational, personal reading interests and other information needs.
                </p>

                <ul className="space-y-4 text-primary-700 list-disc pl-6">
                  <li>
                    For faculty members, we can help you find resources you need for class preparation and syllabi development. We encourage reservation for a particular book you use as textbook in your classes so we can determine our capacity to accommodate as well as set aside adequate number of copies for all your students.
                  </li>
                  <li>
                    For Researchers and freelance info-seekers, we can assist you in finding resources for specific to general subjects through the use of our online public access catalog (OPAC) and other online databases.
                  </li>
                  <li>
                    For freshmen, annually, we conduct series of library orientation sessions for all of them who are enrolled in English 1 subject. This is done to introduce the students to the features of our library which they would most probably need in their future research endeavors.
                  </li>
                  <li>
                    For our customers' convenience, you may contact us by e-mail or by phone for reservation of materials that may compliment your research needs. Our e-mail addresses are hyperlinked at our "Library Staff" page.
                  </li>
                  <li>
                    For Quick Researchers, we provide references for a various topics through our clippings, abstracts and indexes to our periodical collection.
                  </li>
                  <li>
                    For Computer Savvy clienteles, we have Our library WiFi connected—all for extra convenience in doing "skilled" research on the world wide web using your laptops and other internet-capable gadgets.
                  </li>
                  <li>
                    Our information sources are not confined to print formats alone, COC-PEN library electronic resources are available. You can make a query and an appointment for as to cater your reservation.
                  </li>
                  <li>
                    For those who are undertaking thesis-writing, we encourage you to maximize the resources freely available on the remote databases (peer-reviewed and open-access online journals) which are supplementary to the existing collection that we have in the library. You may see the links at our library's main webpage or you may browse our collection using our Library's Ipads.
                  </li>
                  <li>
                    COC-PEN administrators, faculty, staff, and students may obtain a REFERRAL FORM here in the library if they would like to do research to other ALINET-Member schools.
                  </li>
                  <li>
                    For GENERAL LIBRARY UPDATES, you may visit our Facebook fanpage linked at our library's main page and our Newsletters.
                  </li>
                </ul>
              </div>
            </section>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LibraryServices;
