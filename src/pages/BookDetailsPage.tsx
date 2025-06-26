"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import { Header } from "../components/header"
import { Footer } from "../components/footer"
import { motion } from "framer-motion"
import { Calendar, ArrowLeft, Book, Loader2, ExternalLink } from "lucide-react"
import { generateDestinyUrl, validateDestinyUrl, extractBibID } from "../lib/destiny"
import { BASE_URL } from '../lib/config';

interface Book {
  id: number
  title: string
  destiny_url: string
  added_at: string
  bib_id: string
  img_id: string | null
  book_img: string
}

interface OpenLibraryBook {
  title: string
  authors?: Array<{ name: string }>
  publish_date?: string
  number_of_pages?: number
  subjects?: string[]
  cover_i?: number
  publishers?: string[]
  description?: {
    value: string
  } | string
}

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const [book, setBook] = useState<Book | null>(null)
  const [openLibraryData, setOpenLibraryData] = useState<OpenLibraryBook | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleBookClick = useCallback((destinyUrl: string) => {
    try {
      if (!validateDestinyUrl(destinyUrl)) {
        throw new Error('Invalid Destiny URL');
      }

      const bibID = extractBibID(destinyUrl);
      if (!bibID) {
        throw new Error('Could not extract bibID');
      }

      // Generate a clean welcome URL with the bibID
      const url = generateDestinyUrl(bibID);
      window.open(url, '_blank')?.focus();

    } catch (error) {
      console.error("Error handling book click:", error);
      alert("Error accessing the catalog. Please try again in a moment.");
    }
  }, [])

  useEffect(() => {
    const fetchBookDetails = async () => {
      setIsLoading(true)
      try {
        // Fetch book details from our database
        const response = await fetch(
          `${BASE_URL}api/book.php?operation=getBookById&json={"id":${id}}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        if (data.status === "success" && data.data) {
          setBook(data.data)

          // First search for the book to get its OpenLibrary ID
          const searchResponse = await fetch(
            `https://openlibrary.org/search.json?q=${encodeURIComponent(data.data.title)}&limit=1`,
          )

          if (searchResponse.ok) {
            const searchData = await searchResponse.json()
            if (searchData.docs && searchData.docs.length > 0) {
              const workId = searchData.docs[0].key

              // Then fetch detailed book information using the Works API
              const detailsResponse = await fetch(
                `https://openlibrary.org${workId}.json`
              )

              if (detailsResponse.ok) {
                const detailsData = await detailsResponse.json()
                setOpenLibraryData({
                  ...detailsData,
                  // Include search results data that might be useful
                  publish_date: searchData.docs[0].publish_date?.[0],
                  publishers: searchData.docs[0].publisher,
                  number_of_pages: searchData.docs[0].number_of_pages,
                })

                // If there are author IDs, fetch author details
                if (detailsData.authors) {
                  const authorPromises = detailsData.authors.map(async (author: { author: { key: string } }) => {
                    const authorResponse = await fetch(`https://openlibrary.org${author.author.key}.json`)
                    if (authorResponse.ok) {
                      return authorResponse.json()
                    }
                    return null
                  })

                  const authors = await Promise.all(authorPromises)
                  setOpenLibraryData(prev => ({
                    ...prev!,
                    authors: authors.filter(a => a !== null).map(author => ({ name: author.name }))
                  }))
                }
              }
            }
          }
        } else {
          setError("Book not found")
        }
      } catch (error) {
        console.error("Error fetching book details:", error)
        setError(error instanceof Error ? error.message : "Failed to load book details")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchBookDetails()
    }
  }, [id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="w-full h-[50vh] flex flex-col items-center justify-center">
          <motion.div
            className="w-16 h-16 text-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Loader2 className="w-16 h-16 animate-spin" />
          </motion.div>
          <p className="mt-4 text-gray-500 font-medium">Loading book details...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-white ">
        <Header />
        <div className="container mx-auto px-4 mt-[10vh] py-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600 mb-8">{error || "Book not found"}</p>
            <Link
              to="/books"
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Books
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto mt-[10vh] px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/books"
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium mb-8 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Books
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Book Cover */}
              <div className="md:col-span-1">
                <motion.div
                  className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <img
                    src={`data:image/${typeof book.book_img === 'string' && book.book_img.substring(0, 4) === 'R0lG' ? 'gif' : 'jpeg'};base64,${book.book_img}`}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/book-placeholder.jpg"
                    }}
                  />
                </motion.div>
                <button
                      onClick={() => handleBookClick(book.destiny_url)}
                      className="px-4 py-2 mt-6 bg-green-800 hover:scale-110 duration-300 text-white rounded-lg text-sm flex items-center hover:bg-green-950 transition-all"
                    >
                      <ExternalLink className="mr-1.5 h-4 w-4" />
                      View in Library Catalog
                    </button>
              </div>

              {/* Book Details */}
              <div className="md:col-span-2">
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center">
                      <Calendar className="mr-1.5 h-3.5 w-3.5" />
                      Added on {formatDate(book.added_at)}
                    </span>

                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{book.title}</h1>

                  {/* Additional details from Open Library */}
                  {openLibraryData && (
                    <div className="space-y-6">
                      {openLibraryData.authors && openLibraryData.authors.length > 0 && (
                        <p className="text-xl text-gray-600">
                          by {openLibraryData.authors.map(author => author.name).join(", ")}
                        </p>
                      )}

                      {typeof openLibraryData.description === 'string' ? (
                        <div className="prose max-w-none">
                          <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                          <p className="text-gray-600">{openLibraryData.description}</p>
                        </div>
                      ) : openLibraryData.description?.value ? (
                        <div className="prose max-w-none">
                          <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                          <p className="text-gray-600">{openLibraryData.description.value}</p>
                        </div>
                      ) : null}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {openLibraryData.publish_date && (
                          <div>
                            <p className="text-sm text-gray-500">Publication Date</p>
                            <p className="text-gray-900">{openLibraryData.publish_date}</p>
                          </div>
                        )}
                        {openLibraryData.publishers && openLibraryData.publishers.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-500">Publisher</p>
                            <p className="text-gray-900">{openLibraryData.publishers[0]}</p>
                          </div>
                        )}
                        {openLibraryData.number_of_pages && (
                          <div>
                            <p className="text-sm text-gray-500">Pages</p>
                            <p className="text-gray-900">{openLibraryData.number_of_pages}</p>
                          </div>
                        )}
                        {/*{book.bib_id && (*/}
                        {/*  <div>*/}
                        {/*    <p className="text-sm text-gray-500">Bib ID</p>*/}
                        {/*    <p className="text-gray-900">{book.bib_id}</p>*/}
                        {/*  </div>*/}
                        {/*)}*/}
                      </div>

                      {openLibraryData.subjects && openLibraryData.subjects.length > 0 && (
                        <div className="space-y-2 border-t pt-6">
                          <p className="text-sm text-gray-500">Subjects</p>
                          <div className="flex flex-wrap gap-2">
                            {openLibraryData.subjects.slice(0, 5).map((subject, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

    </div>
  )
}

export default BookDetailsPage
