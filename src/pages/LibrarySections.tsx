import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { motion } from 'framer-motion';

const LibrarySections = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="relative flex-grow pt-24 pb-16">
        <div className="absolute inset-0" style={{
          backgroundImage: "url('https://coc.phinma.edu.ph/wp-content/uploads/2024/03/PHINMA-COC-MAIN.jpg')",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "blur(8px)",
          zIndex: -1
        }} />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-3xl font-bold mb-8 text-white">Library Sections</h1>

            <section className="mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md prose max-w-none">
                <p>
                  Cagayan de Oro College Library aims of the optimum access to the collection by its clientele, thus open-shelve system is followed. Organization of the library collection is based on the Library of Congress (LC) Classification System.
                </p>
                <p>
                  The Library is located at the third floor of the Annex Building, divided into the following Sections:
                </p>
              </div>
            </section>

            {/* Circulation Desk */}
            <section className="mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">CIRCULATION DESK</h2>
                <p className="mb-6">
                  Loaning out and/or returning of books is charged in here. Reserved books by the faculty and students are also shelved here.
                </p>
                <img
                  src={'https://likecoclib.wordpress.com/wp-content/uploads/2014/10/1-circulation-section.jpg?w=520&h=204'}
                  alt="Circulation Desk"
                  className="w-full h-auto rounded-md shadow"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
            </section>

            {/* Circulation Section */}
            <section className="mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">CIRCULATION SECTION</h2>
                <p className="mb-6">
                  The Circulation Section houses the collection in all subject areas as classified by the LC. These are the collections which can be loaned out by the students and faculty.
                </p>
                {/* No image for this section as specified */}
              </div>
            </section>

            {/* General Reference Section */}
            <section className="mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">GENERAL REFERENCE SECTION</h2>
                <p className="mb-6">
                  The Collection in this Section is composed of Handbooks and Manuals, Encyclopedias and Dictionaries, Thesauri, Almanacs, Maps and Globes, Directories, and Atlases. Access to these collections is limited for inside the library use only.
                </p>
                <img
                  src={'https://likecoclib.wordpress.com/wp-content/uploads/2014/10/1-general-reference-section.jpg?w=520&h=204'}
                  alt="General Reference Section"
                  className="w-full h-auto rounded-md shadow"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
            </section>

            {/* Graduate Studies Section */}
            <section className="mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">GRADUATE STUDIES SECTION</h2>
                <p className="mb-6">
                  Part of the collection for the Graduate Studies are books in the fields of Criminology, Education and Organizational Management.
                </p>
                <img
                  src={'https://likecoclib.wordpress.com/wp-content/uploads/2014/10/1-graduate-section.jpg?w=520&h=204'}
                  alt="Graduate Studies Section"
                  className="w-full h-auto rounded-md shadow"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
            </section>

            {/* Filipiniana Section */}
            <section className="mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">FILIPINIANA SECTION</h2>
                <p className="mb-6">
                  COC-PEN library preserves collection on Philippines' cultural heritage. At this section are books published in the Philippines, books authored by Filipinos and books about the Philippines regardless of author and place of publication.
                </p>
                <img
                  src={'https://likecoclib.wordpress.com/wp-content/uploads/2014/10/1-filipiniana-section.jpg'}
                  alt="Filipiniana Section"
                  className="w-full h-auto rounded-md shadow"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
            </section>

            {/* Periodical Section */}
            <section className="mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">PERIODICAL SECTION</h2>
                <p className="mb-6">
                  This section houses the periodical collection such as journals, magazines and newspapers. At present, COCPEN has subscribeb to Infotrac Custom 100, a database of 100 journal titles. Only bonafide Students, Faculty and Employees of COCPEN can access. To get the password, please see the librarians. Index of the periodicals are also integrated into the Athena system.
                </p>
                <p className="mb-6">
                  All resources at this Section are limited for inside the library use only, except for a special request by a faculty for his use in the classroom. Indexes to previous issues of subscribed periodicals are available and can be accessed upon request.
                </p>
                <p className="mb-6">
                  Newspaper clippings are on display and are categorized by subject.
                </p>
                <img
                  src={'https://likecoclib.wordpress.com/wp-content/uploads/2014/10/1-periodicals-section.jpg?w=520&h=204'}
                  alt="Periodical Section"
                  className="w-full h-auto rounded-md shadow"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
            </section>

            {/* Electronic Resource Section */}
            <section className="mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">ELECTRONIC RESOURCE SECTION</h2>
                <p className="mb-6">
                  Our library's electronic resources collection includes CDs, DVDs, and tranparencies in which access is exclusively for inside the library use only, except for faculty members for their use in the classroom.
                </p>
                <img
                  src={'https://likecoclib.wordpress.com/wp-content/uploads/2014/10/1-electronic-resource-section.jpg?w=520&h=204'}
                  alt="Electronic Resource Section"
                  className="w-full h-auto rounded-md shadow"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
            </section>

            {/* Technical Section */}
            <section className="mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">TECHNICAL SECTION</h2>
                <p className="mb-6">
                  This Section is responsible for the Library's technical services management which include activities such as acquisition, cataloging, classification, preservation, conservation, repair and binding of library materials.
                </p>
                <img
                  src="/technical-section.jpg"
                  alt="Technical Section"
                  className="w-full h-auto rounded-md shadow"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
            </section>

            {/* Basic Education Library */}
            <section className="mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">BASIC EDUCATION LIBRARY</h2>
                <p className="mb-6">
                  The Library is intended for the use of the elementary and high school Students. However, it is allowed that a college student may use the collection by asking permission from the School Librarian.
                </p>
                {/* No image for this section as specified */}
              </div>
            </section>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LibrarySections;
