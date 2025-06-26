import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
import FeaturedBooks from './pages/FeaturedBooks';
import AdminEvents from './pages/AdminEvents';
import LoginPage from './pages/LoginPage';
import LibraryHistory from './pages/LibraryHistory';
import MissionVision from './pages/MissionVision';
import OpenAccess from './pages/OpenAccess';
import FAQ from './pages/FAQ';
import ProtectedRoute from './components/ProtectedRoute';
import LibraryServices from './pages/LibraryServices';
import LibrarySections from './pages/LibrarySections';
import LibraryPolicies from './pages/LibraryPolicies';
import EventsPage from './pages/EventsPage';
import AdminFaqPage from './pages/AdminFaqPage';
import { FaqChat } from './components/FaqChat';
import BooksPage from "./pages/BooksPage"
import BookDetailsPage from "./pages/BookDetailsPage"
import UnitLibraries from "./pages/UnitLibraries";
import AdminLibraries from './pages/AdminLibraries';
import AdminServicesPage from './pages/AdminServices';
import ServicesPage from './pages/LibraryServices';
// import { SessionDebugger } from './components/SessionDebugger';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/library-history" element={<LibraryHistory />} />
        <Route path="/mission-vision" element={<MissionVision />} />
        <Route path="/open-access" element={<OpenAccess />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/library-services" element={<LibraryServices />} />
        <Route path="/library-sections" element={<LibrarySections />} />
        <Route path="/library-policies" element={<LibraryPolicies />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailsPage />} />
        <Route path="/unit-library/:id" element={<UnitLibraries/>}/>
        <Route path="/services" element={<ServicesPage/>}/>
        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute requiredRole="admin">
              <FeaturedBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/faq"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminFaqPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/libraries"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLibraries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminServicesPage/>
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* <SessionDebugger /> */}
      <FaqChat />
      <ToastContainer />
    </Router>
  );
}

export default App;
