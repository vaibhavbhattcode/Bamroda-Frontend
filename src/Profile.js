import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    photo: "",
    surname: "",
    name: "",
    fatherName: "",
    dob: "",
    age: "",
    mobile: "",
    address: "",
    achievements: [],
    certificates: [],
  });
  const [newAchievement, setNewAchievement] = useState({
    type: "",
    description: "",
    year: "",
  });
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [previewCertificates, setPreviewCertificates] = useState([]);
  const [certificatesToDelete, setCertificatesToDelete] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const profileData = response.data;

      setProfile(profileData);
      setFormData({
        photo: profileData.photo,
        surname: profileData.surname,
        name: profileData.name,
        fatherName: profileData.fatherName,
        dob: profileData.dob,
        age: profileData.age,
        mobile: profileData.mobile,
        address: profileData.address,
        achievements: profileData.achievements || [],
        certificates: profileData.certificates || [],
      });

      setPreviewPhoto(
        profileData.photo
          ? `${process.env.REACT_APP_API_URL}/uploads/${profileData.photo}`
          : ""
      );
      setPreviewCertificates(profileData.certificates || []);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const calculateAge = (dob) => {
    const [day, month, year] = dob.split("-");
    const birthDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "dob") {
      const [year, month, day] = value.split("-");
      const formattedDob = `${day}-${month}-${year}`;
      const age = calculateAge(formattedDob);
      setFormData({ ...formData, dob: formattedDob, age });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      if (!file) return;

      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        return;
      } else if (file.size > 2 * 1024 * 1024) {
        alert("File size should not exceed 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => setPreviewPhoto(reader.result);
      reader.readAsDataURL(file);

      setFormData({ ...formData, photo: file });
    }

    if (name === "certificates") {
      const tooLargeFiles = [];
      const newFiles = Array.from(files).filter((file) => {
        if (file.type !== "application/pdf") {
          alert(`${file.name} is not a PDF. Only PDF files are allowed.`);
          return false;
        } else if (file.size > 2 * 1024 * 1024) {
          tooLargeFiles.push(file.name);
          return false;
        }
        return true;
      });

      if (tooLargeFiles.length > 0) {
        alert(
          `The following files are too large (max 2MB): ${tooLargeFiles.join(
            ", "
          )}.`
        );
      }

      setFormData({
        ...formData,
        certificates: [...formData.certificates, ...newFiles],
      });
      setPreviewCertificates([
        ...previewCertificates,
        ...newFiles.map((file) => file.name),
      ]);
    }
  };

  const handleAddAchievement = () => {
    if (
      !newAchievement.type ||
      !newAchievement.description ||
      !newAchievement.year
    ) {
      alert("All achievement fields are required.");
      return;
    }
    setFormData({
      ...formData,
      achievements: [...formData.achievements, newAchievement],
    });
    setNewAchievement({ type: "", description: "", year: "" });
  };

  const handleDeleteAchievement = (index) => {
    const updatedAchievements = formData.achievements.filter(
      (_, idx) => idx !== index
    );
    setFormData({ ...formData, achievements: updatedAchievements });
  };

  const handleDeleteCertificate = (index) => {
    const certificateToDelete = formData.certificates[index];

    if (typeof certificateToDelete === "string") {
      setCertificatesToDelete([...certificatesToDelete, certificateToDelete]);
    }

    setFormData({
      ...formData,
      certificates: formData.certificates.filter((_, idx) => idx !== index),
    });
    setPreviewCertificates(
      previewCertificates.filter((_, idx) => idx !== index)
    );
  };

  const validateForm = () => {
    const requiredFields = [
      "surname",
      "name",
      "fatherName",
      "dob",
      "mobile",
      "address",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`${field} is required.`);
        return false;
      }
    }
    return true;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "achievements") {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === "certificates") {
          formData[key].forEach((cert) => {
            if (cert instanceof File) {
              data.append(key, cert);
            } else {
              data.append(`${key}[]`, cert);
            }
          });
        } else {
          data.append(key, formData[key]);
        }
      });

      if (certificatesToDelete.length > 0) {
        data.append(
          "certificatesToDelete",
          JSON.stringify(certificatesToDelete)
        );
      }

      await axios.post(
        `${process.env.REACT_APP_API_URL}/update-profile`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated successfully!");
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 border border-emerald-100">
          {profile && !editMode ? (
            <div>
              {/* Profile Header */}
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-amber-100 shadow-md">
                  <img
                    src={previewPhoto || "/default-avatar.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="mt-4 text-3xl font-serif font-bold text-emerald-800">
                  {profile.name} {profile.surname}
                </h2>
                <p className="mt-2 text-emerald-600">
                  Village Community Member
                </p>
              </div>

              {/* Personal & Contact Information */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-xl bg-emerald-50 border-emerald-100">
                  <h3 className="text-xl font-serif font-medium text-emerald-800 mb-4">
                    Personal Information
                  </h3>
                  <ul className="text-emerald-700 space-y-3">
                    <li className="flex justify-between">
                      <span className="font-medium">First Name:</span>
                      {profile.name}
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">Surname:</span>
                      {profile.surname}
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">Father's Name:</span>
                      {profile.fatherName}
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">Date of Birth:</span>
                      {profile.dob}
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">Age:</span>
                      {profile.age}
                    </li>
                  </ul>
                </div>

                <div className="p-6 border rounded-xl bg-emerald-50 border-emerald-100">
                  <h3 className="text-xl font-serif font-medium text-emerald-800 mb-4">
                    Contact Information
                  </h3>
                  <ul className="text-emerald-700 space-y-3">
                    <li className="flex justify-between">
                      <span className="font-medium">Mobile:</span>
                      {profile.mobile}
                    </li>
                    <li>
                      <span className="font-medium block mb-2">Address:</span>
                      <p className="text-emerald-600">{profile.address}</p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Achievements */}
              <div className="mt-8">
                <h3 className="text-2xl font-serif font-medium text-emerald-800 mb-6">
                  Achievements
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="p-4 border rounded-lg bg-amber-50 border-amber-100"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                          <span className="text-amber-600">🏆</span>
                        </div>
                        <h4 className="text-lg font-medium text-emerald-800">
                          {ach.type}
                        </h4>
                      </div>
                      <p className="text-emerald-600 text-sm">
                        {ach.description}
                      </p>
                      <span className="text-xs text-amber-600">{ach.year}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificates */}
              <div className="mt-8">
                <h3 className="text-2xl font-serif font-medium text-emerald-800 mb-6">
                  Certificates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {previewCertificates.map((cert, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-white hover:bg-emerald-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <a
                          href={`${process.env.REACT_APP_API_URL}/uploads/${cert}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:text-emerald-900 flex items-center gap-2"
                        >
                          <svg
                            className="w-5 h-5 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="truncate">{cert}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setEditMode(true)}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile}>
              <h2 className="text-3xl font-serif font-bold text-emerald-800 mb-8 text-center">
                Update Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Photo */}
                <div className="md:col-span-2">
                  <label className="block text-emerald-800 font-medium mb-4">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-100 shadow-inner">
                      {previewPhoto ? (
                        <img
                          src={previewPhoto}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-emerald-100 text-emerald-500">
                          <svg
                            className="w-12 h-12"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      name="photo"
                      onChange={handleFileChange}
                      className="py-2 px-4 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Personal Information Fields */}
                {[
                  { label: "Surname", name: "surname", type: "text" },
                  { label: "Name", name: "name", type: "text" },
                  { label: "Father's Name", name: "fatherName", type: "text" },
                  { label: "Date of Birth", name: "dob", type: "date" },
                  { label: "Age", name: "age", type: "number", readOnly: true },
                  { label: "Mobile", name: "mobile", type: "text" },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-emerald-800 font-medium">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={
                        field.name === "dob"
                          ? formData.dob.split("-").reverse().join("-")
                          : formData[field.name]
                      }
                      onChange={handleInputChange}
                      readOnly={field.readOnly}
                      className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                ))}

                {/* Address */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-emerald-800 font-medium">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 h-32"
                  />
                </div>

                {/* Achievements Section */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-2xl font-serif font-medium text-emerald-800">
                    Achievements
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <select
                      value={newAchievement.type}
                      onChange={(e) =>
                        setNewAchievement({
                          ...newAchievement,
                          type: e.target.value,
                        })
                      }
                      className="px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Type</option>
                      <option value="Academic">Academic</option>
                      <option value="Sports">Sports</option>
                      <option value="Professional">Professional</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Description"
                      value={newAchievement.description}
                      onChange={(e) =>
                        setNewAchievement({
                          ...newAchievement,
                          description: e.target.value,
                        })
                      }
                      className="px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="number"
                      placeholder="Year"
                      value={newAchievement.year}
                      onChange={(e) =>
                        setNewAchievement({
                          ...newAchievement,
                          year: e.target.value,
                        })
                      }
                      className="px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddAchievement}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.achievements.map((ach, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-4 border border-emerald-100 rounded-lg bg-amber-50"
                      >
                        <div>
                          <p className="font-medium text-emerald-800">
                            {ach.type}
                          </p>
                          <p className="text-sm text-emerald-600">
                            {ach.description}
                          </p>
                          <p className="text-xs text-amber-600">{ach.year}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteAchievement(idx)}
                          className="text-amber-600 hover:text-amber-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certificates Section */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-2xl font-serif font-medium text-emerald-800">
                    Certificates
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {previewCertificates.map((cert, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 border border-emerald-100 rounded-lg bg-white hover:bg-emerald-50"
                      >
                        <a
                          href={`${process.env.REACT_APP_API_URL}/uploads/${cert}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:text-emerald-900 flex items-center gap-2"
                        >
                          <svg
                            className="w-5 h-5 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="truncate">{cert}</span>
                        </a>
                        <button
                          onClick={() => handleDeleteCertificate(idx)}
                          className="text-amber-600 hover:text-amber-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="file"
                    name="certificates"
                    accept="application/pdf"
                    multiple
                    onChange={handleFileChange}
                    className="py-2 px-4 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Form Actions */}
                <div className="md:col-span-2 flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2 border border-emerald-200 text-emerald-800 rounded-lg hover:bg-emerald-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
