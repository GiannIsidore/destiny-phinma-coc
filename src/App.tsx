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
        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute>
              <FeaturedBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <AdminEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/faq"
          element={
            <ProtectedRoute>
              <AdminFaqPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
