// AdminAddEvent.js
import React, { useState } from "react";
import axios from "axios";

const AdminAddEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Only accept files that start with "image/"
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setMessage("");
    } else {
      setMessage("Please upload a valid image file.");
      e.target.value = null; // clear file input if invalid
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
      if (imageFile) data.append("image", imageFile);

      await axios.post(`${process.env.REACT_APP_API_URL}/api/events`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Event added successfully!");
      // Optionally, clear the form fields here:
      setFormData({
        title: "",
        description: "",
        location: "",
        date: "",
      });
      setImageFile(null);
    } catch (err) {
      setMessage("Error adding event.");
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add New Event</h2>
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
        {/* Only allow image files */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-green-600 text-white p-2 rounded">
          Add Event
        </button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default AdminAddEvent;
