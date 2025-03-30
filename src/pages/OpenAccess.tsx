import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const OpenAccess = () => {
  const databases = [
    {
      name: "Directory of Open Access Journals (DOAJ)",
      url: "https://doaj.org/",
      description: "A community-curated online directory that indexes and provides access to high quality, open access, peer-reviewed journals."
    },
    {
      name: "PubMed Central (PMC)",
      url: "https://www.ncbi.nlm.nih.gov/pmc/",
      description: "A free full-text archive of biomedical and life sciences journal literature at the U.S. National Institutes of Health's National Library of Medicine."
    },
    {
      name: "arXiv",
      url: "https://arxiv.org/",
      description: "An open-access repository of electronic preprints and postprints approved for posting after moderation, but not full peer review."
    },
    {
      name: "CORE",
      url: "https://core.ac.uk/",
      description: "The world's largest collection of open access research papers."
    },
    {
      name: "OpenDOAR",
      url: "https://v2.sherpa.ac.uk/opendoar/",
      description: "An authoritative directory of academic open access repositories."
    },
    {
      name: "Project Gutenberg",
      url: "https://www.gutenberg.org/",
      description: "A library of over 60,000 free eBooks, focusing on older works for which copyright has expired."
    },
    {
      name: "Open Library",
      url: "https://openlibrary.org/",
      description: "An open, editable library catalog, building towards a web page for every book ever published."
    },
    {
      name: "SciELO",
      url: "https://scielo.org/",
      description: "A bibliographic database, digital library, and cooperative electronic publishing model of open access journals."
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
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-3xl font-bold mb-8 text-primary">Open Access Databases</h1>

            <p className="text-lg mb-8">
              Open Access databases provide free, immediate, online access to scholarly research,
              allowing anyone to read, download, copy, distribute, and use content with minimal restrictions.
              Below is a curated list of valuable open access resources for your research needs.
            </p>

            <div className="grid gap-6">
              {databases.map((db, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h2 className="text-xl font-bold mb-2 text-primary">
                    <a
                      href={db.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-primary/80 transition-colors"
                    >
                      {db.name}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </h2>
                  <p className="text-gray-700">{db.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-primary">Why Use Open Access Resources?</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Free access to scholarly research without paywalls</li>
                <li>Increased visibility and impact of research</li>
                <li>Accelerated discovery and innovation</li>
                <li>Improved educational opportunities for all</li>
                <li>Greater public engagement with research</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OpenAccess;
