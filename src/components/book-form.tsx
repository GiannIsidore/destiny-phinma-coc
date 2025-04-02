/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { toast } from 'react-toastify'
import { booksAPI } from '../services/api'
import type { BookData } from '../services/api'

interface BookFormProps {
  isAuthenticated: boolean
  editingBook?: BookData
  onSuccess?: () => void
}

export function BookForm({ isAuthenticated, editingBook, onSuccess }: BookFormProps) {
  const [title, setTitle] = useState('')
  const [destinyUrl, setDestinyUrl] = useState('')
  const [preview, setPreview] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [author, setAuthor] = useState('')
  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title)
      setDestinyUrl(editingBook.destiny_url)
      setPreview(`data:image/jpeg;base64,${editingBook.book_img}`)
    }
  }, [editingBook])

  const extractBibId = (url: string) => {
    const match = url.match(/bibID=(\d+)/i)
    return match ? match[1] : null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to manage books")
      return
    }

    if (!file && !editingBook?.book_img) {
      toast.error("Please select a cover image")
      return
    }

    const bibId = extractBibId(destinyUrl)
    if (!bibId) {
      toast.error("Invalid Destiny URL format - missing bibID")
      return
    }

    setLoading(true)
    try {
      const bookData: BookData = {
        title,
        destiny_url: destinyUrl,
        bib_id: bibId,
        ...(editingBook && { id: editingBook.id, img_id: editingBook.img_id }),
      }

      if (file) {
        bookData.book_img = file
      }

      if (editingBook) {
        const response = await booksAPI.updateBook(bookData)
        if (response.data.status === 'success') {
          toast.success("Book updated successfully!")
        } else {
          throw new Error(response.data.message)
        }
      } else {
        const response = await booksAPI.addBook(bookData)
        if (response.data.status === 'success') {
          toast.success("Book added successfully!")
        } else {
          throw new Error(response.data.message)
        }
      }

      // Reset form
      setTitle('')
      setDestinyUrl('')
      setPreview('')
      setFile(null)

      // Call success callback
      onSuccess?.()
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Error managing book')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 w-full h-full p-4 bg-white rounded-lg shadow-md">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Book Title</label>
        <input
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
    <div className="space-y-2">
      <label className="block text-sm font-medium">Author</label>
      <input
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter author name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

    </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Destiny URL</label>
        <input
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Paste Destiny URL here"
          value={destinyUrl}
          onChange={(e) => setDestinyUrl(e.target.value)}
        />
        <p className="text-xs text-gray-500">
          Example: ...?bibID=12345
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium">Book Cover</label>
        <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-28 w-full object-cover rounded"
              height={28}
              width={28}
            />
          ) : (
            <div className="text-gray-500 text-center p-4">
              <svg
                className="w-8 h-8 mx-auto mb-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="block">Click to upload cover image</span>
              <p className="text-xs mt-1">(JPEG, PNG - Max 5MB)</p>
            </div>
          )}
        </label>
        {file && (
          <p className="text-sm text-gray-600 truncate">
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={!title || !destinyUrl || (!file && !editingBook?.book_img) || loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {editingBook ? 'Updating...' : 'Adding...'}
          </span>
        ) : (
          editingBook ? 'Update Book' : 'Add Book'
        )}
      </Button>
    </div>
  )
}
