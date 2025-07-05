// AdminManageEvents.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AdminManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/events`);
      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching events");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(events.filter((event) => event._id !== id));
      } catch (err) {
        alert("Error deleting event");
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Events</h2>
      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p>{error}</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Title</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Location</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td className="py-2 px-4 border">{event.title}</td>
                <td className="py-2 px-4 border">
                  {new Date(event.date).toLocaleString()}
                </td>
                <td className="py-2 px-4 border">{event.location}</td>
                <td className="py-2 px-4 border flex space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => navigate(`/admin/events/edit/${event._id}`)}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(event._id)}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminManageEvents;
