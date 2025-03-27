"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Pencil, Loader2 } from "lucide-react"
import { toast } from 'react-toastify'

import { booksAPI } from "../services/api"
import type { BookData } from "../services/api"

interface EditBookDialogProps {
  book: BookData
  onSuccess: () => void
}

export function EditBookDialog({ book, onSuccess }: EditBookDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(book.title)
  const [destinyUrl, setDestinyUrl] = useState(book.destiny_url)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(`data:image/jpeg;base64,${book.book_img}`)


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const bibId = extractBibID(destinyUrl)
      if (!bibId) {
        throw new Error("Invalid Destiny URL")
      }

      const bookData: BookData = {
        id: book.id,
        title,
        destiny_url: destinyUrl,
        bib_id: bibId,
        img_id: book.img_id,
      }

      if (image) {
        bookData.book_img = image
      }

      const response = await booksAPI.updateBook(bookData)
      if (response.data.status === 'success') {
        toast.success("Book updated successfully")
        setOpen(false)
        onSuccess()
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('Error updating book:', error)
      toast.error("Failed to update book")
    } finally {
      setLoading(false)
    }
  }

  const extractBibID = (url: string) => {
    const match = url.match(/bibID=(\d+)/i)
    return match ? match[1] : null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destiny_url">Destiny URL</Label>
            <Input
              id="destiny_url"
              value={destinyUrl}
              onChange={(e) => setDestinyUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Cover Image</Label>
            <div className="flex items-center gap-4">
              <div className="relative h-40 w-32 overflow-hidden rounded-md">
                <img
                  src={imagePreview}
                  alt={title}
                  className="object-cover"
                />
              </div>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="max-w-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
