// EventsList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const EventsList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/events`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
      {events.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="border rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              {event.image && (
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${event.image}`}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  {new Date(event.date).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mb-2">{event.location}</p>
                <p className="text-gray-800">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No events available at the moment.</p>
      )}
    </div>
  );
};

export default EventsList;
