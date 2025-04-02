import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { motion } from 'framer-motion';

const LibraryPolicies = () => {
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
            <h1 className="text-4xl font-bold mb-8 text-primary bg-secondary p-2 w-fit rounded">Library Policies</h1>

            {/* Eligibility Section */}
            <section className="mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-primary">Eligibility</h2>
                <p className="mb-4">
                  The following COC-PEN constituents are eligible to have a COC-PEN Library Card:
                </p>
                <ul className="list-disc pl-8 mb-6 space-y-1">
                  <li>COC-PEN currently enrolled students</li>
                  <li>COC-PEN faculty member (full-time/part-time), and</li>
                  <li>COC-PEN staff member or school administrator</li>
                </ul>

                <p className="mb-4">
                  You may go to the designated Circulation Desk and we will issue the card immediately. For the students, you are required to present your STUDY LOAD and your 1 X 1 RECENT PHOTO upon applying for a library card. For the faculty members, you will immediately be given a special card that your respective Deans must sign it first before you will be allowed to loan out library materials.
                </p>

                <p className="mb-4">
                  We also extend services to the following:
                </p>
                <ul className="list-disc pl-8 mb-6 space-y-1">
                  <li>COC-PEN Alumni</li>
                  <li>Visiting researchers (eg. student from other ALINET member schools). A fee of 20.00 php per visit is charged to the visiting researcher from any of the ALINET member schools.</li>
                  <li>Visiting researchers from non-ALINET member schools is charged 50.00 php per visit.</li>
                </ul>
              </div>
            </section>

            {/* Borrowing Privileges Section */}
            <section className="mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-primary">Borrowing Privileges</h2>
                <ul className="pl-8 space-y-3 mb-4">
                  <li className="flex">
                    <span className="font-medium text-gray-800 mr-2">•</span>
                    <span>Undergraduate students can loan out maximum of two (2) books for three (3) days; the date a student loans out a material is counted as the first day of the three (3)- day allowable borrowing period of books for circulation.</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium text-gray-800 mr-2">•</span>
                    <span>Graduate students can loan out maximum of three (3) books for one week; the date a student loans out a material is counted as the first day of the one week allowable borrowing period of books for circulation.</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium text-gray-800 mr-2">•</span>
                    <span>Alumni and other visiting researchers are not allowed to loan out our library's resources.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Fines and Penalties Section */}
            <section className="mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-primary">Fines and Penalties</h2>
                <p className="mb-4 font-semibold">
                  Records of Penalties are submitted to and collected by the School's Business Office. A student with unpaid penalty is denied for a library clearance.
                </p>
                <ul className="pl-8 space-y-3 mb-4">
                  <li className="flex">
                    <span className="font-medium text-gray-800 mr-2">•</span>
                    <span>Penalty for overdue loaned-out books is 5.00 php per day, per book.</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium text-gray-800 mr-2">•</span>
                    <span>Reserved books that are prescribed by faculty members as textbooks for their classes are for inside the library use only. This is to ensure that all students can be accommodated in using the materials. Photocopying of this material outside the library should take for a maximum of two (2) hours only. 5.00 php per hour is charged beyond the alloted time. Excess of 10-minute extension after two (2) hours is considered one (1) hour late.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Photocopying Section */}
            <section className="mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-primary">Photocopying</h2>
                <p className="mb-4">
                  COC-PEN Library adheres to the Philippine Copyright and Intellectual Property Right Laws. Not everything in the library is allowed for photocopy.
                </p>
              </div>
            </section>

            {/* General Rules Section */}
            <section className="mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-primary">General Rules</h2>
                <p className="mb-4 font-semibold">
                  The following are rules that need to be observed while inside the library premise. Note: Any Violation to these rules will be subject for serious disciplinary action:
                </p>
                <ul className="pl-8 space-y-3 mb-4">
                  <li className="flex">
                    <span className="font-medium text-gray-800 mr-2">•</span>
                    <span>Silence must be observed. Mobile phones must be turned into silent or vibra mode.</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium text-gray-800 mr-2">•</span>
                    <span>Avoid eating inside the library's premise. Bringing of bottled drinking liquids is allowed, however, do not place such on the table to avoid spillage that might damage any library material.</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium text-gray-800 mr-2">•</span>
                    <span>Do not mutilate any library materials.</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium text-gray-800 mr-2">•</span>
                    <span>Doing projects inside the library more particularly 'cutting of papers' is strictly prohibited. Our library is solely for study and research.</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium text-gray-800 mr-2">•</span>
                    <span>Do not disarrange library's chairs and tables nor making graffiti on it.</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium text-gray-800 mr-2">•</span>
                    <span>Do not leave the table dirty.</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium text-gray-800 mr-2">•</span>
                    <span>Put your used books on the designated BOOK DROP.</span>
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

export default LibraryPolicies;
