// import { Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>

            <ul className="space-y-3">

            <li className="flex items-center gap-2">
                <strong className="text-accent">Gmail:</strong>
                <a href="mailto:frmi.turtosa.coc@phinmaed.com" className="hover:text-accent transition-colors">
                frmi.turtosa.coc@phinmaed.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <strong className="text-accent">Gmail:</strong>
                <a href="mailto:library.coc@phinmaed.com" className="hover:text-accent transition-colors">
                  library.coc@phinmaed.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <strong className="text-accent">FB Page:</strong>
                <a
                  href="https://facebook.com/PHINMACOCLibrary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors flex items-center gap-1"
                >
                  <span>PHINMA COC Library</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <strong className="text-accent">FB Account:</strong>
                <a
                  href="https://facebook.com/askvirla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors flex items-center gap-1"
                >
                  <span>Ask Virla</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </li>
            </ul>

            {/* <p className="mt-2">For book reservation and online queries, fill up this form:</p>
            <a
              href="https://forms.gle/LrYTLt6DopDanp8i7"
              className="underline hover:text-accent transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Online Query Form
            </a> */}
          </div>
          {/* <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/national-book-week" className="hover:underline">
                  National Book Week
                </a>
              </li>
              <li>
                <a href="/e-books" className="hover:underline">
                  Free Access e-Books
                </a>
              </li>
              <li>
                <a href="/databases" className="hover:underline">
                  Free Databases
                </a>
              </li>
              <li>
                <a href="/theses" className="hover:underline">
                  Open Access Thesis
                </a>
              </li>
              <li>
                <a href="/ched-connect" className="hover:underline">
                  PHL CHED CONNECT
                </a>
              </li>
              <li>
                <a href="/events" className="hover:underline">
                  Events
                </a>
              </li>
            </ul>
          </div> */}
          {/* <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram />
              </a>
            </div>
          </div> */}
        </div>
        <div className="mt-8 pt-8 border-t border-primary-foreground/10 text-center">
          <p>Copyright © {new Date().getFullYear()} PHINMA COC Library. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
