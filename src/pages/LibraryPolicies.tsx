import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { API_URL } from "../lib/config";

interface ContentData {
  id: number;
  content_type: string;
  title: string;
  content: string;
}

const LibraryPolicies = () => {
  const [policies, setPolicies] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch(
          `${API_URL}/content.php?type=library_policies`,
        );
        const data = await response.json();

        if (data.status === "success" && data.data) {
          setPolicies(data.data);
        }
      } catch (error) {
        console.error("Error fetching policies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  // Simple markdown renderer for policies
  const renderMarkdown = (content: string) => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let currentSection: JSX.Element[] = [];
    let sectionKey = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith("## ")) {
        // Save previous section if exists
        if (currentSection.length > 0) {
          elements.push(
            <section key={sectionKey++} className="mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md">
                {currentSection}
              </div>
            </section>,
          );
          currentSection = [];
        }

        // Start new section with heading
        currentSection.push(
          <h2 key={`h2-${i}`} className="text-2xl font-bold mb-4 text-primary">
            {line.substring(3)}
          </h2>,
        );
      } else if (line.startsWith("**") && line.endsWith("**")) {
        // Bold text
        currentSection.push(
          <p key={`bold-${i}`} className="mb-4 font-semibold">
            {line.substring(2, line.length - 2)}
          </p>,
        );
      } else if (line.startsWith("- ")) {
        // List item
        currentSection.push(
          <li key={`li-${i}`} className="flex">
            <span className="font-medium text-gray-800 mr-2">•</span>
            <span>{line.substring(2)}</span>
          </li>,
        );
      } else if (line === "") {
        // Empty line - close list if we were in one
        continue;
      } else if (line.length > 0) {
        // Regular paragraph
        currentSection.push(
          <p key={`p-${i}`} className="mb-4">
            {line}
          </p>,
        );
      }
    }

    // Add final section
    if (currentSection.length > 0) {
      elements.push(
        <section key={sectionKey} className="mb-10">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {currentSection}
          </div>
        </section>,
      );
    }

    return elements;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="relative flex-grow pt-24 pb-16">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://coc.phinma.edu.ph/wp-content/uploads/2024/03/PHINMA-COC-MAIN.jpg')",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            filter: "blur(8px)",
            zIndex: -1,
          }}
        />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-8 text-primary bg-secondary p-2 w-fit rounded">
              {policies?.title || "Library Policies"}
            </h1>

            {policies?.content ? (
              renderMarkdown(policies.content)
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p>Loading policies...</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LibraryPolicies;
