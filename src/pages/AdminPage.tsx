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
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import AdminServicesPage from "./AdminServices";
import { motion, AnimatePresence } from "framer-motion";

const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activePage, setActivePage] = useState('events');
  const user = sessionManager.getSession();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // On mobile, start with sidebar closed
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        // On desktop, start with sidebar open
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
      case 'events':
        return <FeaturedEvents />;
      case 'scholars':
        return <ScholarsAdmin />;
      case 'books':
        return <FeaturedBooks />;
      case 'faq':
        return <AdminFaqPage />;
      case 'libraries':
        return <AdminLibraries />;
      case 'services':
        return <AdminServicesPage />;
      case 'content':
        return <AdminContent />;
      default:
        return <FeaturedEvents />;
    }
  };

  const menuItems = [
    { key: 'events', label: 'Events', icon: Calendar },
    { key: 'scholars', label: 'Scholars', icon: Users },
    { key: 'books', label: 'Books', icon: BookOpen },
    { key: 'faq', label: 'FAQ', icon: HelpCircle },
    { key: 'libraries', label: 'Libraries', icon: Library },
    { key: 'services', label: 'Services', icon: Cog },
    { key: 'content', label: 'Content', icon: FileText },
  ];

  const sidebarWidth = isSidebarOpen ? 'w-72' : 'w-16';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 lg:hidden z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? (isSidebarOpen ? 288 : 0) : (isSidebarOpen ? 288 : 64),
          x: isMobile && !isSidebarOpen ? -288 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          ${isMobile ? 'fixed' : 'relative'}
          bg-white shadow-xl z-50 h-screen flex flex-col overflow-hidden
          border-r border-gray-200
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <motion.div
              initial={false}
              animate={{ opacity: isSidebarOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-3"
            >
              {isSidebarOpen && (
                <>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Library className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-gray-800">Admin Panel</h2>
                    <p className="text-xs text-gray-500">Library Management</p>
                  </div>
                </>
              )}
            </motion.div>
            
            {!isMobile && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                {isSidebarOpen ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}

            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            
            return (
              <motion.button
                key={item.key}
                onClick={() => {
                  setActivePage(item.key);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center p-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3 font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <motion.button
            onClick={() => window.open('/', '_blank')}
            className="w-full flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title={!isSidebarOpen ? "Visit Website" : undefined}
          >
            <Home className="w-5 h-5 flex-shrink-0 text-gray-500" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3 font-medium"
                >
                  Visit Website
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center p-3 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-gray-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title={!isSidebarOpen ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 text-gray-500" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3 font-medium"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30"
        >
          <div className="px-4 lg:px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {isMobile && (
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                    {menuItems.find(item => item.key === activePage)?.label} Management
                  </h1>
                  <p className="text-sm text-gray-500 hidden sm:block">
                    Manage your library {activePage} efficiently
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                  <span>Welcome,</span>
                  <span className="font-medium">{user?.fname}</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium shadow-lg">
                  {user?.fname?.[0]?.toUpperCase() || 'A'}
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-full"
          >
            <div className="p-6">
              {renderContent()}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;