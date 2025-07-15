import ScholarsAdmin from "./AdminScholars";
import FeaturedBooks from "./FeaturedBooks";
import FeaturedEvents from "./FeaturedEvents";
import AdminFaqPage from "./AdminFaqPage";
import AdminLibraries from "./AdminLibraries";
import AdminContent from "./AdminContent";
import { useState, useEffect } from "react";
import { sessionManager } from "../utils/sessionManager";
import {
  LogOut,
  Menu,
  BookOpen,
  Users,
  Calendar,
  HelpCircle,
  X,
  Library,
  Cog,
  FileText,
} from "lucide-react";
import AdminServicesPage from "./AdminServices";

const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activePage, setActivePage] = useState("events");
  const user = sessionManager.getSession();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    sessionManager.clearSession();
    window.location.href = "/";
  };

  const renderContent = () => {
    switch (activePage) {
      case "events":
        return <FeaturedEvents />;
      case "scholars":
        return <ScholarsAdmin />;
      case "books":
        return <FeaturedBooks />;
      case "faq":
        return <AdminFaqPage />;
      case "libraries":
        return <AdminLibraries />;
      case "services":
        return <AdminServicesPage />;
      case "content":
        return <AdminContent />;
      default:
        return <FeaturedEvents />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-72 lg:w-20 xl:w-72 bg-white shadow-xl transition-all duration-300 z-40
          h-screen flex flex-col
        `}
      >
        <div className="p-4 h-full flex flex-col border-r border-gray-200">
          <div className="flex items-center justify-between mb-8 px-2">
            {isSidebarOpen ? (
              <h2 className="font-bold text-xl text-gray-800">Admin Panel</h2>
            ) : (
              <div className="w-8 h-8 bg-blue-500 rounded-lg" />
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <nav className="space-y-1 flex-1">
            <button
              onClick={() => setActivePage("events")}
              className={`w-full flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors ${
                activePage === "events" ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              <Calendar size={20} className="min-w-[20px]" />
              <span
                className={`ml-3 ${!isSidebarOpen && "lg:hidden xl:inline"}`}
              >
                Events
              </span>
            </button>
            <button
              onClick={() => setActivePage("scholars")}
              className={`w-full flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors ${
                activePage === "scholars" ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              <Users size={20} className="min-w-[20px]" />
              <span
                className={`ml-3 ${!isSidebarOpen && "lg:hidden xl:inline"}`}
              >
                Scholars
              </span>
            </button>
            <button
              onClick={() => setActivePage("books")}
              className={`w-full flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors ${
                activePage === "books" ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              <BookOpen size={20} className="min-w-[20px]" />
              <span
                className={`ml-3 ${!isSidebarOpen && "lg:hidden xl:inline"}`}
              >
                Books
              </span>
            </button>
            <button
              onClick={() => setActivePage("libraries")}
              className={`w-full flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors ${
                activePage === "libraries" ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              <Library size={20} className="min-w-[20px]" />
              <span
                className={`ml-3 ${!isSidebarOpen && "lg:hidden xl:inline"}`}
              >
                Libraries
              </span>
            </button>
            <button
              onClick={() => setActivePage("faq")}
              className={`w-full flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors ${
                activePage === "faq" ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              <HelpCircle size={20} className="min-w-[20px]" />
              <span
                className={`ml-3 ${!isSidebarOpen && "lg:hidden xl:inline"}`}
              >
                FAQ
              </span>
            </button>
            <button
              onClick={() => setActivePage("services")}
              className={`w-full flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors ${
                activePage === "services" ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              <Cog size={20} className="min-w-[20px]" />
              <span
                className={`ml-3 ${!isSidebarOpen && "lg:hidden xl:inline"}`}
              >
                Services
              </span>
            </button>
            <button
              onClick={() => setActivePage("content")}
              className={`w-full flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors ${
                activePage === "content" ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              <FileText size={20} className="min-w-[20px]" />
              <span
                className={`ml-3 ${!isSidebarOpen && "lg:hidden xl:inline"}`}
              >
                Content
              </span>
            </button>
          </nav>

          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={20} className="min-w-[20px]" />
              <span
                className={`ml-3 ${!isSidebarOpen && "lg:hidden xl:inline"}`}
              >
                Logout
              </span>
            </button>
            <button className="w-full flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors">
              <BookOpen size={20} className="min-w-[20px]" />
              <a
                href="/"
                className={`ml-3 ${!isSidebarOpen && "lg:hidden xl:inline"}`}
              >
                Back to landing page
              </a>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 w-full lg:overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="px-4 py-4 md:py-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  className="lg:hidden"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu size={24} />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  {activePage.charAt(0).toUpperCase() + activePage.slice(1)}{" "}
                  Management
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Welcome, {user?.fname}
                </span>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {user?.fname[0].toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-100">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
