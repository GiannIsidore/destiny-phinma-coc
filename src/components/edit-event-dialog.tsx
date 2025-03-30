"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Pencil, Loader2 } from "lucide-react"
import { toast } from 'react-toastify'

import type { EventData } from "../services/api"

interface EditEventDialogProps {
  event: EventData
  onSuccess: () => void
}

const API_URL = 'http://localhost/destiny-phinma-coc/api';

export function EditEventDialog({ event, onSuccess }: EditEventDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(event.title)
  const [desc, setDesc] = useState(event.descrip)
  const [link, setLink] = useState(event.link)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(`data:image/jpeg;base64,${event.event_image}`)

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
      // Create form data
      const formData = new FormData()

      // Base64 conversion for image if a new one is selected
      let base64Image = ''
      if (image) {
        const reader = new FileReader()
        base64Image = await new Promise((resolve, reject) => {
          reader.onload = () => {
            try {
              const base64String = reader.result as string
              resolve(base64String.split(',')[1]) // Remove data:image/jpeg;base64, prefix
            } catch (error) {
              reject(error)
            }
          }
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(image)
        })
      }

      // Create event data object
      const eventData = {
        id: event.id,
        title,
        descrip: desc,
        link,
        img_id: event.img_id,
        ...(base64Image && { event_image: base64Image })
      }

      // Append to formData
      formData.append('operation', 'updateEvent')
      formData.append('json', JSON.stringify(eventData))

      // Submit using fetch
      const response = await fetch(`${API_URL}/event.php`, {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.status === 'success') {
        toast.success("Event updated successfully")
        setOpen(false)
        onSuccess()
      } else {
        throw new Error(result.message || 'Server error')
      }
    } catch (error) {
      console.error('Error updating event:', error)
      toast.error("Failed to update event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
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
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link (Optional)</Label>
            <Input
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Event Image</Label>
            <div className="flex items-center gap-4">
              <div className="relative h-40 w-32 overflow-hidden rounded-md">
                <img
                  src={imagePreview}
                  alt={title}
                  className="object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    (e.target as HTMLImageElement).src = '/placeholder.jpg';
                  }}
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
