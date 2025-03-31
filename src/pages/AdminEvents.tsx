'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Trash2, Upload } from 'lucide-react'
import { toast } from 'react-toastify'
import { EditEventDialog } from '../components/edit-event-dialog'
import type { EventData } from '../services/api'
import { API_URL } from '../lib/config'

interface Event extends EventData {
  created_at: string
}

const EventsAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [link, setLink] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchEvents = useCallback(async () => {
    console.log('Fetching events...')
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/event.php?operation=getEvents`)
      const data = await response.json()

      if (data.status === 'success') {
        console.log(`Fetched ${data.data.length} events`)
        setEvents(data.data)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error("Failed to fetch events")
    } finally {
      setLoading(false)
    }
  }, [])

  // Add a helper function to check if base64 is valid
  const isValidBase64 = useCallback((str: string | undefined) => {
    if (!str) return false
    try {
      // Simple check for valid base64 characters
      return /^[A-Za-z0-9+/=]+$/.test(str) && str.length > 100;
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    const authStatus = localStorage.getItem('isAdmin')
    if (authStatus) setIsAuthenticated(true)
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title)
      setDesc(editingEvent.descrip)
      setLink(editingEvent.link)
      setPreview(`data:image/jpeg;base64,${editingEvent.event_image}`)
    } else {
      resetForm()
    }
  }, [editingEvent])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const resetForm = () => {
    setTitle('')
    setDesc('')
    setLink('')
    setFile(null)
    setPreview('')
    setEditingEvent(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error("Please sign in to manage events")
      return
    }

    setSubmitting(true)
    try {
      // Create form data
      const formData = new FormData()

      // Base64 conversion like in book-form.tsx
      let base64Image = ''
      if (file) {
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
          reader.readAsDataURL(file)
        })
      }

      // Create event data object
      const eventData = {
        title,
        descrip: desc,
        link,
        ...(editingEvent && { id: editingEvent.id, img_id: editingEvent.img_id }),
        ...(base64Image && { event_image: base64Image })
      }

      // Append to formData
      formData.append('operation', editingEvent ? 'updateEvent' : 'addEvent')
      formData.append('json', JSON.stringify(eventData))

      // Submit using fetch instead of axios
      const response = await fetch(`${API_URL}/event.php`, {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.status === 'success') {
        toast.success(editingEvent ? "Event updated successfully!" : "Event added successfully!")
        resetForm()
        fetchEvents()
      } else {
        throw new Error(result.message || 'Server error')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Error managing event')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number | undefined) => {
    if (!id || !window.confirm('Are you sure you want to delete this event?')) return

    try {
      // Create form data like the other API calls
      const formData = new FormData()
      formData.append('operation', 'deleteEvent')
      formData.append('json', JSON.stringify({ id }))

      // Use fetch instead of axios
      const response = await fetch(`${API_URL}/event.php`, {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.status === 'success') {
        toast.success("Event deleted successfully")
        fetchEvents()
      } else {
        throw new Error(result.message || 'Server error')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error("Failed to delete event")
    }
  }

  return (
    <div className="h-fit m-4 rounded-sm w-full p-8 mx-auto bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Events</h1>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          {editingEvent ? 'Edit Event' : 'Add New Event'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg shadow-md p-6">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={desc}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDesc(e.target.value)}
              placeholder="Enter event description"
              required
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Link (Optional)</label>
            <Input
              value={link}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLink(e.target.value)}
              placeholder="Enter event link"
              type="url"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Event Image</label>
            <div className="mt-2">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    width={300}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setFile(null)
                      setPreview('')
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      required={!editingEvent}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingEvent ? 'Update Event' : 'Add Event'}
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Events</h2>
        {loading ? (
          <div className="text-center">Loading events...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="relative h-48 mb-4">
                  {event.event_image && typeof event.event_image === 'string' && isValidBase64(event.event_image) ? (
                    <img
                      src={`data:image/jpeg;base64,${event.event_image}`}
                      alt={event.title}
                      className="object-cover w-full h-full rounded-md"
                      onError={(e) => {
                        // Only set placeholder once to avoid multiple requests
                        if ((e.target as HTMLImageElement).src !== `${window.location.origin}/placeholder.jpg`) {
                          console.error('Image failed to load for event:', event.id);
                          (e.target as HTMLImageElement).src = '/placeholder.jpg';
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {event.descrip}
                </p>
                {event.link && (
                  <p className="text-blue-500 text-sm mb-4 truncate">
                    <a href={event.link} target="_blank" rel="noopener noreferrer">
                      {event.link}
                    </a>
                  </p>
                )}
                <div className="flex justify-end gap-2">
                  <EditEventDialog event={event} onSuccess={fetchEvents} />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
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

export default EventsAdmin
