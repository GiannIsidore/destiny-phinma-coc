'use client'

import { BookForm } from '../components/book-form'
import { Button } from '../components/ui/button'
import { Trash2 } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { booksAPI } from '../services/api'
import type { BookData } from '../services/api'
import { toast } from 'react-toastify'
import { EditBookDialog } from '../components/edit-book-dialog'

const FeaturedBooks = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [books, setBooks] = useState<BookData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBooks = useCallback(async () => {
    try {
      const response = await booksAPI.getBooks()
      if (response.data.status === 'success') {
        // Log the raw image data to debug
        console.log('Raw book_img:', response.data.data[0].book_img)
        setBooks(response.data.data)
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('Error fetching books:', error)
      toast.error("Failed to fetch books")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const authStatus = localStorage.getItem('isAdmin')
    if (authStatus) setIsAuthenticated(true)
  }, [])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return

    try {
      const response = await booksAPI.deleteBook(id)
      if (response.data.status === 'success') {
        toast.success("Book deleted successfully")
        fetchBooks()
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('Error deleting book:', error)
      toast.error("Failed to delete book")
    }
  }

  return (
    <div className="h-fit m-4 rounded-sm w-full p-8 mx-auto bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Carousel Books</h1>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
        <BookForm
          isAuthenticated={isAuthenticated}
          onSuccess={fetchBooks}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Books</h2>
        {loading ? (
          <div className="text-center">Loading books...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="relative h-80 mb-4">
                  {book.book_img && (
                    <img
                      src={`data:image/jpeg;base64,${book.book_img}`}
                      alt={book.title}
                      className="object-cover w-full h-full rounded-md"
                      onError={(e) => {
                        console.error('Image failed to load:', e);
                        (e.target as HTMLImageElement).src = 'fallback-image.jpg';
                      }}
                    />
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                <p className="text-gray-600 mb-2">BibID: {book.bib_id}</p>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {book.destiny_url}
                </p>
                <div className="flex justify-end gap-2">
                  <EditBookDialog book={book} onSuccess={fetchBooks} />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(book.id!)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FeaturedBooks
