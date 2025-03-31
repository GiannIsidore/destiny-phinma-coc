import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavDropdown } from './nav-dropdown';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const aboutDropdownItems = [
    { label: 'Mission Vision', href: '/mission-vision', isExternal: false },
    { label: 'Library History', href: '/library-history', isExternal: false },
    { label: 'Library Sections', href: '/library-sections', isExternal: false },
    { label: 'Library Services', href: '/library-services', isExternal: false },
    { label: 'Library Policies', href: '/library-policies', isExternal: false },
  ];

  const linkagesDropdownItems = [
    { label: 'OPAC', href: 'https://phinmacoclibrary-opac.follettdestiny.com', isExternal: true },
    { label: 'Philippine eJournals', href: 'https://ejournals.ph/', isExternal: true },
    { label: 'EBSCO Host', href: 'https://search.ebscohost.com/', isExternal: true },
    { label: 'DOAJ', href: 'https://doaj.org/', isExternal: true },
    { label: 'Open Access Databases', href: '/open-access' },
  ];

  const resourcesDropdownItems = [
    { label: 'Recommend a Book', href: 'https://docs.google.com/forms/d/1oUmw9g7yoClchMHM-pzrdrW7Jce9n1ofOPKR3xDizDw', isExternal: true },
    { label: 'Ask Virla', href: 'https://www.facebook.com/share/18vXMFiEpU/', isExternal: true },
    { label: 'FAQ', href: '/faq' },
  ];


  const headerHeight = scrolled ? '3.5rem' : '4rem';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-gray-200 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}
        style={{ height: headerHeight }}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-800">
            <img src={'logo.jpg'} alt="Logo" className="w-10 h-10" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <NavDropdown label="About" items={aboutDropdownItems} />
            <NavDropdown label="Linkages" items={linkagesDropdownItems} />
            <NavDropdown label="Resources" items={resourcesDropdownItems} />
            <Link to="/events" className="text-gray-600 hover:text-gray-900">
              Events
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="fixed md:hidden bg-white border-t border-gray-200 z-[9998] w-full"
          style={{ top: headerHeight }}
        >
          <div className="container mx-auto px-4 py-3 space-y-3">
            <Link
              to="/"
              className="block py-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            <div className="py-2">
              <div className="font-medium text-gray-800 mb-2">About</div>
              <div className="pl-4 space-y-2">
                {aboutDropdownItems.map((item, index) =>
                  item.isExternal ? (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={index}
                      to={item.href}
                      className="block text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </div>

            <div className="py-2">
              <div className="font-medium text-gray-800 mb-2">Linkages</div>
              <div className="pl-4 space-y-2">
                {linkagesDropdownItems.map((item, index) =>
                  item.isExternal ? (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={index}
                      to={item.href}
                      className="block text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </div>

            <div className="py-2">
              <div className="font-medium text-gray-800 mb-2">Resources</div>
              <div className="pl-4 space-y-2">
                {resourcesDropdownItems.map((item, index) =>
                  item.isExternal ? (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={index}
                      to={item.href}
                      className="block text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </div>

            <Link
              to="/events"
              className="block py-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
