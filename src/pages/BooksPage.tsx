"use client"

import { useState, useEffect } from "react"
import { Header } from "../components/header"
import { Footer } from "../components/footer"
import { motion } from "framer-motion"
import { Calendar, Search, Book, X, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import { BASE_URL } from '../lib/config'

interface Book {
  id: number
  title: string
  destiny_url: string
  added_at: string
  bib_id: string
  img_id: string | null
  book_img: string
}

interface BooksResponse {
  status: string
  data: Book[]
}

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${BASE_URL}api/book.php?operation=getBooks`)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data: BooksResponse = await response.json()

        if (data.status === "success" && Array.isArray(data.data)) {
          // Sort books in descending order by created_at
          const sortedBooks = data.data.sort(
            (a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime(),
          )
          setBooks(sortedBooks)
        } else {
          console.error("Invalid data format received from API")
          setBooks([])
        }
      } catch (error) {
        console.error("Error fetching books:", error)
        setError(error instanceof Error ? error.message : "Failed to load books")
        setBooks([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  // Loading animation
  const loadingVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  // Filter books based on search term
  const filteredBooks = books.filter(
    (book) => book.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get featured book (first/latest book from filtered results)
  const featuredBook = filteredBooks.length > 0 ? filteredBooks[0] : null
  // Get remaining books
  const remainingBooks = filteredBooks.length > 0 ? filteredBooks.slice(1) : []

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="w-full h-[50vh] flex flex-col items-center justify-center">
          <motion.div
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <motion.p className="mt-4 text-gray-500 font-medium" variants={loadingVariants} animate="animate">
            Loading library books...
          </motion.p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <motion.div
          className="w-full py-24 flex items-center justify-center flex-col gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-red-500 text-3xl">!</span>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800">Error loading books</h2>
          <p className="text-gray-600 max-w-md text-center">{error}</p>
          <motion.button
            className="mt-4 px-8 py-3 bg-primary text-white rounded-lg font-medium"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </motion.button>
        </motion.div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow mt-[7vh]">
        {/* Hero search section */}
        <motion.div
          className="bg-gray-50 py-12 border-b border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            backgroundImage: "url('/shelf.jpg')",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Library Books Collection
              </motion.h1>
              <motion.p
                className="text-lg text-white/85 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Discover our latest additions and explore our growing collection
              </motion.p>

              <motion.div
                className="relative max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search books by title, author, or description..."
                  className="w-full py-4 pl-12 pr-12 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={handleClearSearch}
                  >
                    <X size={18} />
                  </button>
                )}
              </motion.div>

              {/* Search results indicator */}
              {searchTerm && (
                <motion.div
                  className="mt-4 text-sm text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Found {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} for "{searchTerm}"
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Featured book section */}
        {featuredBook && (
          <motion.section className="py-12 md:py-16" initial="hidden" animate="visible" variants={containerVariants}>
            <div className="container mx-auto px-4">
              <motion.div variants={itemVariants} className="mb-8">
                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-medium rounded-full text-sm mb-4">
                  Featured
                </span>
                <h2 className="text-2xl font-bold text-gray-800">
                  {searchTerm ? "Top Search Result" : "Latest Addition"}
                </h2>
              </motion.div>

              <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl shadow-lg group">
                <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  <img
                    src={`data:image/${typeof featuredBook.book_img === 'string' && featuredBook.book_img.substring(0, 4) === 'R0lG' ? 'gif' : 'jpeg'};base64,${featuredBook.book_img}`}
                    alt={featuredBook.title}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/book-placeholder.jpg"
                    }}
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
                    <div className="max-w-3xl">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm flex items-center">
                          <Calendar className="mr-1.5 h-3.5 w-3.5" />
                          {formatDate(featuredBook.added_at)}
                        </span>
                      </div>

                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                        {featuredBook.title}
                      </h1>
                      <Link to={`/books/${featuredBook.id}`}>
                          <motion.button
                            className="text-white bg-gray-800 rounded-4xl px-2 py-1 font-medium text-sm flex items-center"
                            whileHover={{ x: 3 }}
                          >
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </motion.button>
                        </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Book collection section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              className="flex flex-wrap items-center justify-between mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-800">
                {searchTerm ? "Search Results" : "Book Collection"}
              </h2>
            </motion.div>

            {remainingBooks.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {remainingBooks.map((book) => (
                  <motion.article
                    key={book.id}
                    variants={itemVariants}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={`data:image/${typeof book.book_img === 'string' && book.book_img.substring(0, 4) === 'R0lG' ? 'gif' : 'jpeg'};base64,${book.book_img}`}
                        alt={book.title}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/book-placeholder.jpg"
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-primary rounded-full text-xs font-medium">
                          {formatDate(book.added_at)}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 hover:text-primary transition-colors">
                        {book.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Book className="mr-1.5 h-3.5 w-3.5" />
                        </span>

                        <Link to={`/books/${book.id}`}>
                          <motion.button
                            className="text-primary font-medium text-sm flex items-center"
                            whileHover={{ x: 3 }}
                          >
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-16 bg-white rounded-xl"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
              >
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-800">No books found</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  {searchTerm
                    ? `No books match your search for "${searchTerm}". Try different keywords.`
                    : "There are currently no books to display."}
                </p>
                {searchTerm && (
                  <motion.button
                    className="mt-6 px-6 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClearSearch}
                  >
                    Clear Search
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default BooksPage
