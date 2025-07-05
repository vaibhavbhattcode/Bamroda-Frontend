// AdminEditEvent.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AdminEditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    image: "", // Will hold File object if changed
  });
  const [existingImage, setExistingImage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/${id}`);
        const event = res.data;
        setFormData({
          title: event.title,
          description: event.description,
          location: event.location,
          date: event.date
            ? new Date(event.date).toISOString().substring(0, 16)
            : "",
          image: "",
        });
        setExistingImage(event.image);
      } catch (err) {
        setMessage("Error fetching event details");
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Only accept image files
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, image: file });
      setMessage("");
    } else {
      setMessage("Please upload a valid image file.");
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("date", formData.date);
      // Append new image only if a file is selected
      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }
      await axios.put(`${process.env.REACT_APP_API_URL}/api/events/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Event updated successfully!");
      navigate("/admin/events/manage");
    } catch (err) {
      setMessage("Error updating event.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Event</h2>
      {message && <p className="mb-2">{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        {existingImage && (
          <div className="mb-2">
            <p>Current Image:</p>
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/${existingImage}`}
              alt="Event"
              className="w-32 h-auto"
            />
          </div>
        )}
        {/* Only allow image files */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-green-600 text-white p-2 rounded">
          Update Event
        </button>
      </form>
    </div>
  );
};

export default AdminEditEvent;
