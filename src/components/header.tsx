import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavDropdown } from './nav-dropdown';
import {Menu, X, Book, LogInIcon} from 'lucide-react';
import { sessionManager } from '../utils/sessionManager';
import { BASE_URL } from '../lib/config'
interface UnitLibrary {
  library_id: number
  library_name: string
  library_description: string

}


export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = sessionManager.getSession() !== null;
  const isAdmin = isLoggedIn && sessionManager.getRole() === 'admin';
  const [unitLibraries, setUnitLibraries] = useState<UnitLibrary[]>([]);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };



  // const [isLoading, setIsLoading] = useState(true)
  // const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUnitLibraries = async () => {
      // setIsLoading(true)
      try {
        const response = await fetch(`${BASE_URL}api/unit_libraries.php?operation=getLibraries`)

        if (!response.ok) {
          console.log(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        if (data.status === "success" && Array.isArray(data.data)) {
          // Sort books in descending order by created_at
          setUnitLibraries(data.data);
        }
      } catch (error) {
        console.error("Error fetching books:", error)

      } finally {
        // setIsLoading(false)
      }
    };
    fetchUnitLibraries();
  }, [])
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const aboutDropdownItems = [
    { label: 'Mission Vision', href: '/mission-vision', isExternal: false },
    { label: 'Library History', href: '/library-history', isExternal: false },
    { label: 'Library Policies', href: '/library-policies', isExternal: false },
  ];
  const unitLibDropdownItems = [

    ...(unitLibraries.map(library => ({
      label: library.library_name,
      href: `/unit-library/${library.library_id}`,
      isExternal: false,
    })))
  ];

  const linkagesDropdownItems = [
    { label: 'PAARL, Inc.Philippine Association of Academic / Research Librarians, Inc.', href: 'https://paarl.org.ph/', isExternal: true },
    {label: 'ALINet' , href: 'https://web.facebook.com/19alinet88?locale=es_LA'},
    { label: 'Philippine eJournals', href: 'https://ejournals.ph/', isExternal: true },
    { label: 'EBSCO Host', href: 'https://search.ebscohost.com/', isExternal: true },
    // { label: 'DOAJ', href: 'https://doaj.org/', isExternal: true },
    // { label: 'Open Access Databases', href: '/open-access', isExternal: false },
  ];

  const servicesDropdownItems = [
    { label: 'Library Services', href: '/services', isExternal: false },
    { label: 'FAQ', href: '/faq', isExternal: false },
    { label: 'Recommend a Book', href: 'https://docs.google.com/forms/d/1oUmw9g7yoClchMHM-pzrdrW7Jce9n1ofOPKR3xDizDw', isExternal: true },
    { label: 'Ask Virla', href: 'https://www.facebook.com/share/18vXMFiEpU/', isExternal: true },
  ];
  const resourcesDropdownItems = [
    { label: 'Books', href: '/books', isExternal: false },
    { label: 'Events', href: '/events', isExternal: false },
    { label: 'FAQ', href: '/faq', isExternal: false },
    { label: 'Recommend a Book', href: 'https://docs.google.com/forms/d/1oUmw9g7yoClchMHM-pzrdrW7Jce9n1ofOPKR3xDizDw', isExternal: true },
    { label: 'Ask Virla', href: 'https://www.facebook.com/share/18vXMFiEpU/', isExternal: true },
  ];
  const databasesDropdownItems = [
    { label: 'OPAC', href: 'https://phinmacoclibrary-opac.follettdestiny.com', isExternal: true },
    { label: 'Philippine eJournals', href: 'https://ejournals.ph/', isExternal: true },
    { label: 'EBSCO Host', href: 'https://search.ebscohost.com/', isExternal: true },
    { label: 'DOAJ', href: 'https://doaj.org/', isExternal: true },
    {label: 'Starbooks', href: 'https://www.starbooks.ph/', isExternal: true},
  ];

  const handleLogout = () => {
    sessionManager.clearSession();
    navigate('/login');
  };

  const headerHeight = scrolled ? '3.5rem' : '4rem';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-gray-200 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}
        style={{ height: headerHeight }}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={'/logo.jpg'} alt="Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-gray-800 hidden sm:inline">PHINMA COC Library</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <NavDropdown label="About" items={aboutDropdownItems} />
            <NavDropdown label="Unit Libraries" items={unitLibDropdownItems} />
            {/* <NavDropdown label="Linkages" items={linkagesDropdownItems} /> */}
            <NavDropdown label="Resources" items={resourcesDropdownItems} />
            <NavDropdown label="Databases" items={databasesDropdownItems} />
           <NavDropdown label='Services' items={servicesDropdownItems} />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Admin or User Actions */}

          {isAdmin ? (
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/admin"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Admin Panel
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-[#1a1a1a] hover:bg-gray-100 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/books"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <Book className="h-4 w-4" />
                <span>Books</span>
              </Link>
              <Link
                to="/faq"
                className="text-gray-600 hover:text-gray-900"
              >
                FAQ
              </Link>
              <Link
                  to="/login"
                  className="text-gray-600 flex items-center justify-center duration-300 transition-all hover:text-gray-900 group"
              >
                <LogInIcon className="w-5 h-5 font-thin" />
                <span className="ml-0 w-0 overflow-hidden group-hover:ml-2 group-hover:w-auto transition-all duration-500">
    login
  </span>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed md:hidden bg-white border-t border-gray-200 z-[9998] w-full overflow-y-auto max-h-[calc(100vh-4rem)]"
          style={{ top: headerHeight }}
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/"
              className="block py-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>


            <div className="py-2 border-t">
              <div className="font-medium text-gray-800 mb-2">About</div>
              <div className="pl-4 space-y-2">
                {aboutDropdownItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    className="block text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="py-2 border-t">
              <div className="font-medium text-gray-800 mb-2">Services</div>
              <div className="pl-4 space-y-2">
                {servicesDropdownItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    className="block text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="py-2 border-t">
              <div className="font-medium text-gray-800 mb-2">Unit Libraries</div>
              <div className="pl-4 space-y-2">
                {unitLibDropdownItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    className="block text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="py-2 border-t">
              <div className="font-medium text-gray-800 mb-2">Unit Libraries</div>
              <div className="pl-4 space-y-2">
                {linkagesDropdownItems.map((item, index) => (
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
                ))}
              </div>
            </div>

            <div className="py-2 border-t">
              <div className="font-medium text-gray-800 mb-2">Resources</div>
              <div className="pl-4 space-y-2">
                {resourcesDropdownItems.map((item, index) => (
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
                ))}
              </div>
            </div>
            <div className="py-2 border-t">
              <div className="font-medium text-gray-800 mb-2">Databases</div>
              <div className="pl-4 space-y-2">
                {databasesDropdownItems.map((item) => (
                  <Link to={item.href} className="block text-sm text-gray-600 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            {
              isLoggedIn ? (
                  isAdmin && (
                      <div className="py-2 border-t">
                        <Link
                            to="/admin"
                            className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                        <button
                            onClick={() => {
                              handleLogout();
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left py-2 text-gray-600 hover:text-gray-900"
                        >
                          Logout
                        </button>
                      </div>
                  )
              ) : (
                  <div className="py-2 border-t">
                    <Link
                        to="/login"
                        className="block py-2 text-gray-600 hover:text-gray-900"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </div>
              )
            }

          </div>
        </div>
      )}
    </>
  );
};
