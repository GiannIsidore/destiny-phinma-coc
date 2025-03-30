"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar, Clock, ArrowRight, X, ExternalLink } from "lucide-react"
import { Badge } from "../components/ui/badge"

interface Event {
  id: number
  title: string
  descrip: string
  link: string
  img_id: number
  created_at: string
  event_image?: string
}

interface EventsResponse {
  status: string
  data: Event[]
}

export default function EventBento() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDialogAnimating, setIsDialogAnimating] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const dialogContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("http://localhost/destiny-phinma-coc/api/event.php?operation=getEvents")

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data: EventsResponse = await response.json()

        if (data.status === "success" && Array.isArray(data.data)) {
          setEvents(data.data)
        } else {
          console.error("Invalid data format received from API")
          setEvents([])
        }
      } catch (error) {
        console.error("Error fetching events:", error)
        setError(error instanceof Error ? error.message : "Failed to load events")
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Handle dialog open with animation
  const openDialog = (event: Event) => {
    setSelectedEvent(event)
    setIsDialogAnimating(true)
    setIsDialogOpen(true)
    document.body.style.overflow = "hidden" // Prevent scrolling when dialog is open

    // Trigger entrance animation
    setTimeout(() => {
      if (dialogContentRef.current) {
        dialogContentRef.current.classList.remove("scale-95", "opacity-0")
        dialogContentRef.current.classList.add("scale-100", "opacity-100")
      }
      setIsDialogAnimating(false)
    }, 50)
  }

  // Handle dialog close with animation
  const closeDialog = () => {
    if (isDialogAnimating) return

    setIsDialogAnimating(true)

    // Trigger exit animation
    if (dialogContentRef.current) {
      dialogContentRef.current.classList.remove("scale-100", "opacity-100")
      dialogContentRef.current.classList.add("scale-95", "opacity-0")
    }

    // Wait for animation to complete before closing
    setTimeout(() => {
      setIsDialogOpen(false)
      setIsDialogAnimating(false)
      document.body.style.overflow = "" // Restore scrolling
    }, 200)
  }

  // Handle click outside dialog
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        closeDialog()
      }
    }

    // Handle escape key press
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDialog()
      }
    }

    if (isDialogOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isDialogOpen, isDialogAnimating])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center flex-col gap-4">
        <div className="text-destructive text-lg">Error loading events</div>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-muted-foreground">No events found</p>
      </div>
    )
  }

  // Handle different layouts based on number of events
  const renderEventLayout = () => {
    if (events.length === 1) {
      // Single event layout - one large featured event
      return (
        <div className="grid grid-cols-1 gap-4" >
          <div className="rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition-all duration-300 relative group ">
            <div className="block  cursor-pointer" onClick={() => openDialog(events[0])}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
              <img
                src={
                  events[0].event_image
                    ? `data:image/jpeg;base64,${events[0].event_image}`
                    : "/placeholder.svg?height=800&width=1200"
                }
                alt={events[0].title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=800&width=1200"
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <Badge className="mb-3 bg-primary text-primary-foreground">Featured Event</Badge>
                <h3 className="text-2xl font-bold mb-2">{events[0].title}</h3>
                <p className="line-clamp-3 text-white/90 mb-3">{events[0].descrip}</p>
                <div className="flex items-center text-sm space-x-4 text-white/80">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{formatDate(events[0].created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{formatTime(events[0].created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (events.length === 2) {
      // Two events layout - one large and one medium
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ minHeight: "500px" }}>
          <div className="md:col-span-2 rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition-all duration-300 relative group h-[500px] md:h-auto">
            <div className="block h-full cursor-pointer" onClick={() => openDialog(events[0])}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
              <img
                src={
                  events[0].event_image
                    ? `data:image/jpeg;base64,${events[0].event_image}`
                    : "/placeholder.svg?height=600&width=800"
                }
                alt={events[0].title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=600&width=800"
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <Badge className="mb-3 bg-primary text-primary-foreground">Featured Event</Badge>
                <h3 className="text-2xl font-bold mb-2">{events[0].title}</h3>
                <p className="line-clamp-2 text-white/90 mb-3">{events[0].descrip}</p>
                <div className="flex items-center text-sm space-x-4 text-white/80">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{formatDate(events[0].created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{formatTime(events[0].created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition-all duration-300 relative group h-[300px] md:h-auto">
            <div className="block h-full cursor-pointer" onClick={() => openDialog(events[1])}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
              <img
                src={
                  events[1].event_image
                    ? `data:image/jpeg;base64,${events[1].event_image}`
                    : "/placeholder.svg?height=400&width=400"
                }
                alt={events[1].title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=400"
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
                <h3 className="text-lg font-bold mb-1">{events[1].title}</h3>
                <div className="flex items-center text-xs space-x-2 text-white/80">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>{formatDate(events[1].created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      // Three or more events - full bento box layout
      return (
        <div
          className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-6 gap-4 auto-rows-fr"
          style={{ minHeight: "800px" }}
        >
          {/* Featured Event - Large */}
          <div className="md:col-span-4 md:row-span-4 rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition-all duration-300 relative group">
            <div className="block h-full cursor-pointer" onClick={() => openDialog(events[0])}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
              <img
                src={
                  events[0].event_image
                    ? `data:image/jpeg;base64,${events[0].event_image}`
                    : "/placeholder.svg?height=600&width=800"
                }
                alt={events[0].title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=600&width=800"
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <Badge className="mb-3 bg-primary text-primary-foreground">Featured Event</Badge>
                <h3 className="text-2xl font-bold mb-2">{events[0].title}</h3>
                <p className="line-clamp-2 text-white/90 mb-3">{events[0].descrip}</p>
                <div className="flex items-center text-sm space-x-4 text-white/80">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{formatDate(events[0].created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{formatTime(events[0].created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Events - Only render if they exist */}
          {events.length > 1 && (
            <div className="md:col-span-2 md:row-span-2 rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition-all duration-300 relative group">
              <div className="block h-full cursor-pointer" onClick={() => openDialog(events[1])}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <img
                  src={
                    events[1].event_image
                      ? `data:image/jpeg;base64,${events[1].event_image}`
                      : "/placeholder.svg?height=400&width=400"
                  }
                  alt={events[1].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=400"
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
                  <h3 className="text-lg font-bold mb-1">{events[1].title}</h3>
                  <div className="flex items-center text-xs space-x-2 text-white/80">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>{formatDate(events[1].created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {events.length > 2 && (
            <div className="md:col-span-2 md:row-span-2 rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition-all duration-300 relative group">
              <div className="block h-full cursor-pointer" onClick={() => openDialog(events[2])}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <img
                  src={
                    events[2].event_image
                      ? `data:image/jpeg;base64,${events[2].event_image}`
                      : "/placeholder.svg?height=400&width=400"
                  }
                  alt={events[2].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=400"
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
                  <h3 className="text-lg font-bold mb-1">{events[2].title}</h3>
                  <div className="flex items-center text-xs space-x-2 text-white/80">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>{formatDate(events[2].created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Small Events - Only render if they exist */}
          {events.length > 3 && (
            <div className="md:col-span-2 md:row-span-2 rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition-all duration-300 relative group">
              <div className="block h-full cursor-pointer" onClick={() => openDialog(events[3])}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <img
                  src={
                    events[3].event_image
                      ? `data:image/jpeg;base64,${events[3].event_image}`
                      : "/placeholder.svg?height=300&width=300"
                  }
                  alt={events[3].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=300&width=300"
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 z-20 text-white">
                  <h3 className="text-sm font-bold">{events[3].title}</h3>
                </div>
              </div>
            </div>
          )}

          {events.length > 4 && (
            <div className="md:col-span-2 md:row-span-2 rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition-all duration-300 relative group">
              <div className="block h-full cursor-pointer" onClick={() => openDialog(events[4])}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <img
                  src={
                    events[4].event_image
                      ? `data:image/jpeg;base64,${events[4].event_image}`
                      : "/placeholder.svg?height=300&width=300"
                  }
                  alt={events[4].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=300&width=300"
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 z-20 text-white">
                  <h3 className="text-sm font-bold">{events[4].title}</h3>
                </div>
              </div>
            </div>
          )}

          {events.length > 5 && (
            <div className="md:col-span-2 md:row-span-2 rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition-all duration-300 relative group">
              <div className="block h-full cursor-pointer" onClick={() => openDialog(events[5])}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <img
                  src={
                    events[5].event_image
                      ? `data:image/jpeg;base64,${events[5].event_image}`
                      : "/placeholder.svg?height=300&width=300"
                  }
                  alt={events[5].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=300&width=300"
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 z-20 text-white">
                  <h3 className="text-sm font-bold">{events[5].title}</h3>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="flex flex-col space-y-4 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Library Events</h2>
        <p className="text-muted-foreground">Discover upcoming events at the PHIMMA COC Library</p>
        {/* View All Events Link - only show if there are more than one event */}
        {events.length > 1 && (
        <div className="">
          <a href="#" className="inline-flex items-center text-green-800 hover:underline font-medium">
            View all events <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      )}
      </div>

      {/* Render the appropriate layout based on number of events */}
      {renderEventLayout()}



      {/* Image Dialog with Animation */}
      {isDialogOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 md:p-8 transition-opacity duration-300 ease-in-out">
          <div
            ref={dialogRef}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <div
              ref={dialogContentRef}
              className="w-full h-full flex flex-col transform scale-95 opacity-0 transition-all duration-200 ease-out"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 id="dialog-title" className="text-xl font-bold truncate">
                  {selectedEvent.title}
                </h3>
                <button
                  onClick={closeDialog}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-auto flex-grow p-4">
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-h-[60vh] overflow-hidden rounded-lg">
                    <img
                      src={
                        selectedEvent.event_image
                          ? `data:image/jpeg;base64,${selectedEvent.event_image}`
                          : "/placeholder.svg?height=800&width=1200"
                      }
                      alt={selectedEvent.title}
                      className="max-w-full h-auto mx-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=800&width=1200"
                      }}
                    />
                  </div>

                  <div className="w-full mt-6 space-y-4">
                    <p className="text-gray-700">{selectedEvent.descrip}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>{formatDate(selectedEvent.created_at)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{formatTime(selectedEvent.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t flex justify-end">
                <button
                  onClick={closeDialog}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors mr-2"
                >
                  Close
                </button>

                {selectedEvent.link && (
                  <a
                    href={selectedEvent.link}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-flex items-center group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                    Follow the link
                    <ExternalLink className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  )}
                </div>
              </div>
          </div>
        </div>
      )}
      </div>
  )
}
