// import { Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p>frmi.turtosa.coc@phinmaed.com</p>
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
