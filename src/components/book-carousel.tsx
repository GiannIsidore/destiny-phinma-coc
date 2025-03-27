"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { generateDestinyUrl, validateDestinyUrl, extractBibID } from "../lib/destiny"
import { booksAPI } from "../services/api"
import type { BookData } from "../services/api"

export function BookCarousel() {
  const [books, setBooks] = useState<BookData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const animationFrame = useRef<number | null>(null)
  const touchStartX = useRef(0)
  const touchDelta = useRef(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const dragThreshold = useRef(0)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)

  const fetchBooks = useCallback(async () => {
    try {
      const response = await booksAPI.getBooks()
      if (response.data.status === 'success') {
        setBooks(response.data.data)
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error("Error fetching books:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const navigate = useCallback((direction: 'prev' | 'next') => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current)
    }

    setCurrentIndex(prev => {
      const newIndex = direction === 'next'
        ? (prev + 1) % books.length
        : (prev - 1 + books.length) % books.length

      animationFrame.current = requestAnimationFrame(() => {
        // Animation cleanup
      })

      return newIndex
    })
  }, [books.length])

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

  // Touch handling implementation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDelta.current = e.touches[0].clientX - touchStartX.current
  }

  const handleTouchEnd = () => {
    if (Math.abs(touchDelta.current) > 50) {
      navigate(touchDelta.current > 0 ? 'prev' : 'next')
    }
    touchStartX.current = 0
    touchDelta.current = 0
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    dragThreshold.current = 0
    setDragStartX(e.clientX)
    longPressTimer.current = setTimeout(() => {
      setIsDragging(true)
    }, 200) // 200ms for long press
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    dragThreshold.current += Math.abs(e.clientX - dragStartX)

    if (dragThreshold.current > 50) {
      navigate(e.clientX > dragStartX ? 'prev' : 'next')
      setDragStartX(e.clientX)
      dragThreshold.current = 0
    }
  }

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
    setIsDragging(false)
    dragThreshold.current = 0
  }

  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center ">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="relative max-w-[95vw] mx-auto px-4 ">
      <h2 className="text-3xl font-bold text-center mb-8 pt-8 text-white relative z-10 text-shadow">New Arrivals</h2>

      <div
        ref={carouselRef}
        className="relative h-[400px] md:h-[500px] touch-pan-y select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {books.map((book, index) => {
          const offset = (index - currentIndex + books.length) % books.length
          const position = offset > books.length / 2 ? offset - books.length : offset

          return (
            <div
              key={book.id}
              className={`absolute w-64 md:w-72 transition-all duration-300 ease-out cursor-grab ${isDragging ? 'cursor-grabbing' : ''} hover:scale-105`}
              style={{
                transform: `translate(-50%, -50%) translateX(${position * 80}%) scale(${1 - Math.abs(position) * 0.15})`,
                opacity: 1 - Math.abs(position) * 0.3,
                zIndex: books.length - Math.abs(position),
                left: '50%',
                top: '50%'
              }}
              onClick={() => !isDragging && handleBookClick(book.destiny_url)}
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
                <img
                  src={`data:image/${typeof book.book_img === 'string' && book.book_img.substring(0, 4) === 'R0lG' ? 'gif' : 'jpeg'};base64,${book.book_img}`}
                  alt={book.title}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 192px, 224px"
                />
              </div>
              <h3 className="mt-2 text-center text-sm font-medium line-clamp-2 text-white text-shadow">{book.title}</h3>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center gap-4 mt-8 pb-8 relative z-10">
        <button
          onClick={() => navigate('prev')}
          className="p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => navigate('next')}
          className="p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
