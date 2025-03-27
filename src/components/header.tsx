import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Destiny
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link to="/events" className="text-gray-600 hover:text-gray-900">Events</Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
