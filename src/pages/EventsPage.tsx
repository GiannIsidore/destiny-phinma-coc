"use client"

import { useState, useEffect } from "react"
import { Header } from "../components/header"
import { Footer } from "../components/footer"
import { motion } from "framer-motion"
import { Calendar, Clock, ChevronRight, Search, BookOpen, X } from "lucide-react"

interface Event {
  id: number
  title: string
  descrip: string
  event_image: string
  created_at: string
  link?: string
}

interface EventsResponse {
  status: string
  data: Event[]
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

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
          // Sort events in descending order by created_at
          const sortedEvents = data.data.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
          )
          setEvents(sortedEvents)
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
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

  // Filter events based on search term
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.descrip.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get featured event (first/latest event from filtered results)
  const featuredEvent = filteredEvents.length > 0 ? filteredEvents[0] : null
  // Get remaining events
  const remainingEvents = filteredEvents.length > 0 ? filteredEvents.slice(1) : []

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
            Loading library events...
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
          <h2 className="text-2xl font-bold text-gray-800">Error loading events</h2>
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
          <div className="container mx-auto px-4"

          >
            <div className="max-w-3xl mx-auto text-center z-[9999]"  >
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}

              >
                Library Events
              </motion.h1>
              <motion.p
                className="text-lg text-white/85 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Discover the latest happenings and activities at our library
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
                  placeholder="Search events by title or description..."
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
                  className="mt-4 text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Found {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} for "{searchTerm}"
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Featured event section */}
        {featuredEvent && (
          <motion.section className="py-12 md:py-16" initial="hidden" animate="visible" variants={containerVariants}>
            <div className="container mx-auto px-4">
              <motion.div variants={itemVariants} className="mb-8">
                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-medium rounded-full text-sm mb-4">
                  Featured
                </span>
                <h2 className="text-2xl font-bold text-gray-800">
                  {searchTerm ? "Top Search Result" : "Latest Event"}
                </h2>
              </motion.div>

              <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl shadow-lg group">
                <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  <img
                    src={
                      featuredEvent.event_image
                        ? `data:image/jpeg;base64,${featuredEvent.event_image}`
                        : "/placeholder.svg"
                    }
                    alt={featuredEvent.title}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                    }}
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
                    <div className="max-w-3xl">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm flex items-center">
                          <Calendar className="mr-1.5 h-3.5 w-3.5" />
                          {formatDate(featuredEvent.created_at)}
                        </span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm flex items-center">
                          <Clock className="mr-1.5 h-3.5 w-3.5" />
                          {formatTime(featuredEvent.created_at)}
                        </span>
                      </div>

                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                        {featuredEvent.title}
                      </h1>

                      <p className="text-white/90 text-lg mb-6 line-clamp-3">{featuredEvent.descrip}</p>

                      {featuredEvent.link && (
                        <motion.a
                          href={featuredEvent.link}
                          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Go to Event's Link
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Recent events section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              className="flex flex-wrap items-center justify-between mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-800">{searchTerm ? "Search Results" : "Recent Events"}</h2>
            </motion.div>

            {remainingEvents.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {remainingEvents.map((event) => (
                  <motion.article
                    key={event.id}
                    variants={itemVariants}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={event.event_image ? `data:image/jpeg;base64,${event.event_image}` : "/placeholder.svg"}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-primary rounded-full text-xs font-medium">
                          {formatDate(event.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-primary transition-colors">
                        {event.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{event.descrip}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 flex items-center">
                          <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                          Library Event
                        </span>

                        {event.link && (
                          <motion.a
                            href={event.link}
                            className="text-primary font-medium text-sm flex items-center"
                            whileHover={{ x: 3 }}
                          >
                            Read More
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </motion.a>
                        )}
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
                <h3 className="text-xl font-medium text-gray-800">No events found</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  {searchTerm
                    ? `No events match your search for "${searchTerm}". Try different keywords.`
                    : "There are currently no events to display."}
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

            {/* Pagination placeholder */}
            {remainingEvents.length > 6 && (
              <motion.div
                className="flex justify-center mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        page === 1 ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Custom CSS for hiding scrollbars */}
      {/* <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style> */}
    </div>
  )
}

export default EventsPage
