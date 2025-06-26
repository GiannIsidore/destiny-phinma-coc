"use client"

import { motion } from "framer-motion"

interface TimelineEventProps {
  year: string
  title: string
  description: string
  isLeft?: boolean
}

export const TimelineEvent = ({ year, title, description, isLeft = true }: TimelineEventProps) => {
  return (
    <div className="relative flex items-center justify-center my-8">
      <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-gray-200" />

      <motion.div
        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`w-full md:w-5/12 ${isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}
      >
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-2">
            {year}
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </motion.div>

      <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white" />
    </div>
  )
}
