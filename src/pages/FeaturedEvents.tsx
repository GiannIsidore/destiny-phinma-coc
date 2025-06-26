'use client'

import { EventForm } from '../components/event-form'
import { Button } from '../components/ui/button'
import { Trash2 } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { eventsAPI } from '../services/api'
import type { EventData } from '../services/api'
import { toast } from 'react-toastify'
import { EditEventDialog } from '../components/edit-event-dialog'
import { sessionManager } from '../utils/sessionManager'

const FeaturedEvents = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const fetchEvents = useCallback(async () => {
    try {
      const response = await eventsAPI.getEvents()
      if (response.data.status === 'success') {
        setEvents(response.data.data)
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('Error fetching books:', error)
      toast.error("Failed to fetch books")
    } finally {
      setLoading(false)
    }
  },[])

  useEffect(() => {
    if (sessionManager.isAuthenticated() && sessionManager.getRole() === 'admin') {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleDelete = async (id:number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return
    try{
      const response = await eventsAPI.deleteEvent(id)
      if (response.data.status === 'success') {
        toast.success("Book deleted successfully")
        fetchEvents()
      } else {
        throw new Error(response.data.message)
      }
    }catch(error){
      console.error('Error deleting book:', error)
      toast.error("Failed to delete book")

    }

  }

  return (
    <div className="max-h-[77vh] m-4 rounded-sm w-full p-8 mx-auto bg-gray-50 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Featured Events</h1>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Add New Event</h2>
        <EventForm
          isAuthenticated={isAuthenticated}
          onSuccess={fetchEvents}
        />
      </div>

      <div className="mt-8 ">
        <h2 className="text-xl font-semibold mb-4">Existing Events</h2>
        {loading ? (
          <div className="text-center">Loading events...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="relative h-80 mb-4">
                  {event.event_image && (
                    <img
                      src={`data:image/jpeg;base64,${event.event_image}`}
                      alt={event.title}
                      className="object-cover w-full h-full rounded-md"
                      onError={(e) => {
                        console.error('Image failed to load:', e);
                        (e.target as HTMLImageElement).src = 'fallback-image.jpg';
                      }}
                    />
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                <p className="text-gray-600 mb-2">{event.descrip}</p>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {event.link}
                </p>
                <div className="flex justify-end gap-2">
                  <EditEventDialog event={event} onSuccess={fetchEvents} />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(event.id!)}
                    className='bg-primary'
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

export default FeaturedEvents
