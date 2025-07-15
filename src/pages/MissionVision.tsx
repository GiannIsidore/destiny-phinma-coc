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

const MissionVision = () => {
  const [mission, setMission] = useState<ContentData | null>(null);
  const [vision, setVision] = useState<ContentData | null>(null);
  const [goals, setGoals] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 underline">$1</a>')
      .replace(/\n/gim, '<br>');
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [missionResponse, visionResponse, goalsResponse] =
          await Promise.all([
            fetch(`${API_URL}/content.php?type=mission`),
            fetch(`${API_URL}/content.php?type=vision`),
            fetch(`${API_URL}/content.php?type=goals`),
          ]);

        const missionData = await missionResponse.json();
        const visionData = await visionResponse.json();
        const goalsData = await goalsResponse.json();

        if (missionData.status === "success" && missionData.data) {
          setMission(missionData.data);
        }
        if (visionData.status === "success" && visionData.data) {
          setVision(visionData.data);
        }
        if (goalsData.status === "success" && goalsData.data) {
          setGoals(goalsData.data);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

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
        <div className="absolute inset-0 bg-[url('https://coc.phinma.edu.ph/wp-content/uploads/2024/03/PHINMA-COC-MAIN.jpg')] bg-fixed bg-center bg-no-repeat bg-cover filter blur-[8px]" />
        <div
          className="relative container mx-auto px-4"
          style={{ zIndex: 100 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-3xl bg-secondary rounded-lg p-2  font-bold mb-8 text-primary">
              Vision & Mission
            </h1>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-primary">
                  {vision?.title || "Vision"}
                </h2>
                <p className="text-lg">
                  {vision?.content ||
                    "The Rosauro P. Dongallo Learning Resource Center envisions itself to be the premier academic information provider and knowledge repository in Northern Mindanao, committed to the development of the total person."}
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-primary">
                  {mission?.title || "Mission"}
                </h2>
                <p className="text-lg">
                  {mission?.content ||
                    "The mission of the COC-PHINMA Education Network Library is to provide quality and updated information resources and user-centered services that will sustain the instructional, research and extension programs of the academic community."}
                </p>
              </div>
            </div>

            <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                {goals?.title || "Our Goals"}
              </h2>
              {goals?.content ? (
                <div
                  className="prose max-w-none text-lg"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(goals.content),
                  }}
                />
              ) : (
                <ul className="list-disc pl-6 space-y-3 text-lg">
                  <li>
                    To build, organize, preserve and make accessible the library's
                    collection.
                  </li>
                  <li>
                    To provide relevant information resources in various formats
                    to support the curriculum.
                  </li>
                  <li>To develop information literacy skills among users.</li>
                  <li>To extend library services to the community.</li>
                  <li>
                    To establish linkages with other libraries and institutions.
                  </li>
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MissionVision;
