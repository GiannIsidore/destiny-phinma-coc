"use client"

import { Header } from "../components/header"
import { Footer } from "../components/footer"
import { motion } from "framer-motion"
import { Calendar, BookOpen, Award, Users } from "lucide-react"

const LibraryHistory = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      {/* Hero Section with New Image */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="/foundingmemlib.jpg"
          alt="Library Building Exterior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white px-4 ">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">Rosauro P. Dongallo</h1>
            <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto drop-shadow-md">
              Learning Resource Center History
            </p>
          </motion.div>
        </div>
      </div>

      <main className="flex-grow pt-12 pb-16">
        <div className="container mx-auto px-4     ">
          {/* Key Facts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto mb-16 "
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Established</h3>
                <p className="text-gray-600">July 13, 2010</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Collection</h3>
                <p className="text-gray-600">Over 25,000 resources</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Named After</h3>
                <p className="text-gray-600">Hon. Rosauro P. Dongallo</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Serves</h3>
                <p className="text-gray-600">Entire PHINMA community</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">Our History</h2>

            <div className="prose prose-lg max-w-none">
              <div className="mb-10 bg-white p-4 rounded-xl shadow-sm"
              >
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                  <img
                    src="/foundingmemlib.jpg"
                    alt="Founding Members of the Rosauro P. Dongallo Learning Resource Center"
                    className="w-full h-auto rounded-lg shadow-md mb-4"
                  />
                </motion.div>
                <p className="text-sm text-center text-gray-600 italic">
                  The unveiling ceremony of the Rosauro P. Dongallo Learning Resource Center (July 13, 2010)
                </p>
              </div>

              <p className="mb-6 text-gray-700 leading-relaxed">
                July 13, 2010 at around three o'clock in the afternoon, dark clouds hovered over the metropolis as heavy
                rains fell at the onset of typhoon Basyang. But the weather was an antithesis to the atmosphere at
                Cagayan de Oro College-PHINMA. Spirits were high as the schools Board of Trustees, PHINMA Education
                Network officers, the Admin Council and the members of the Dongallo family witnessed the brass plate
                marker unveiling ceremony of the Rosauro P. Dongallo Learning Resource Center.
              </p>

              <p className="mb-6 text-gray-700 leading-relaxed">
                Below is an excerpt of the speech delivered by Ramon R. Del Rosario, Jr., President and CEO of
                Philippine Investment Management (PHINMA), Inc. and Chairman of the PHINMA Education Network, as a
                tribute to the late Governor Rosauro P. Dongallo.
              </p>

              <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 bg-primary/5 rounded-r-lg">
                <p className="mb-4 text-gray-700 italic">
                  Today we honour a man who has lived a life of excellence and of service, values that the Cagayan de
                  Oro College PHINMA adheres to.
                </p>
                <p className="mb-4 text-gray-700 italic">
                  Hon. Rosauro Dongallo left his home province of Cebu to join the Armed Forces of the Philippines for a
                  five-year career that would make him instrumental in the fight against the Japanese, earn him
                  recognition from his military superiors, and introduce him to this part of the world.
                </p>
                <p className="mb-4 text-gray-700 italic">
                  It was here in Mindanao that the retired Batallion Commander built his civic life, as he entered the
                  logging and sawmill business with Dongallo Enterprises and grew his network through a partnership with
                  an Indonesian group and through memberships and eventual positions in various local and national
                  organizations.
                </p>
                <p className="mb-4 text-gray-700 italic">
                  It was then during this time, as he was growing his name in the industry, that he was approached by
                  board members of what was then the struggling Parent Teacher College to come in and help rebuild the
                  school. And rebuild it he did, starting out as a financier and later on becoming a president who would
                  donate his whole salary for a scholarship fund to what became the Cagayan de Oro Colleges. He would
                  also later oversee the birth of the College of Engineering, for which we are known today.
                </p>
                <p className="text-gray-700 italic">
                  A well-rounded man in his own right, this once-awarded most outstanding provincial governor truly is a
                  role model for the young minds that we continue to hone in the institution that he built. His legacy
                  is one that we hope to continue, and his example is one that we hope for our graduates to follow.
                </p>
              </blockquote>

              <div className="mt-12 flex justify-center text-black">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center px-6 py-3 bg-primary text-black rounded-full shadow-md hover:bg-primary/90 transition-colors"
                >
                  <BookOpen className="mr-2 h-5 w-5 text-black" />
                  <a href="/" className="text-black">Visit Our Library</a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default LibraryHistory
