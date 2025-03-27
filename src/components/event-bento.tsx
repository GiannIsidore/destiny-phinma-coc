import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { eventsAPI } from '../services/api';
import type { EventData } from '../services/api';

export const EventBento = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventsAPI.getEvents();
        if (response.data.status === 'success') {
          setEvents(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Upcoming Events</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.02 }}
              className={`relative overflow-hidden rounded-lg ${index === 0 || index === 3 ? 'md:col-span-2' : ''}`}
            >
              <img
                src={`data:image/${typeof event.event_image === 'string' && event.event_image.substring(0, 4) === 'R0lG' ? 'gif' : 'jpeg'};base64,${event.event_image}`}
                alt={event.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                  <p className="text-lg">{event.descrip}</p>
                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-white hover:text-gray-200 underline"
                    >
                      Learn More
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
