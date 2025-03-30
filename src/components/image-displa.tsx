"use client"

import { useState } from "react"

interface ImageDisplayProps {
  imageData: string
  alt: string
  className?: string
}

export default function ImageDisplay({ imageData, alt, className = "" }: ImageDisplayProps) {
  const [error, setError] = useState(false)

  // Simple base64 validation
  const isValidBase64 = (str: string) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  if (error || !imageData) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-sm">Image unavailable</span>
      </div>
    )
  }

  // Direct base64 image rendering
  return (
    <img
      src={isValidBase64(imageData)
        ? `data:image/jpeg;base64,${imageData}`
        : '/placeholder.svg'}
      alt={alt}
      className={`object-cover ${className}`}
      onError={(e) => {
        console.error('Image load error');
        setError(true);
        e.currentTarget.src = '/placeholder.svg';
      }}
    />
  )
}
