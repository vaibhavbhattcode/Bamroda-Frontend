import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch, FiUser, FiX, FiDownload } from "react-icons/fi";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/userlist`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId) => {
    try {
      setProfileLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/userprofile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setSelectedProfile(response.data);
    } catch (err) {
      setError("Failed to load profile details.");
    } finally {
      setProfileLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FiUser className="text-indigo-600" />
          User Management
        </h2>
        <div className="w-full sm:max-w-xs relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
          <FiX className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.photo && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${user.photo}`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      )}
                      <span className="font-medium text-gray-800">
                        {user.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => fetchProfile(user.userId)}
                      className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <FiUser className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              No users found matching your search
            </div>
          )}
        </div>
      )}

      {selectedProfile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">User Profile</h3>
              <button
                onClick={() => setSelectedProfile(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {profileLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading profile details...</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Profile Header */}
                <div className="text-center">
                  <div className="inline-block relative">
                  <img
                    src={
                      selectedProfile.photo
                        ? `${process.env.REACT_APP_API_URL}/uploads/${selectedProfile.photo}`
                        : "/default-avatar.png"
                    }
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow"
                  />
                  </div>
                  <h4 className="text-2xl font-bold mt-4">
                    {selectedProfile.surname} {selectedProfile.name}
                  </h4>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Father's Name</p>
                    <p className="font-medium">{selectedProfile.fatherName}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                    <p className="font-medium">
                      {new Date(selectedProfile.dob).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Age</p>
                    <p className="font-medium">{selectedProfile.age}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Contact</p>
                    <p className="font-medium">{selectedProfile.mobile}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  <p className="font-medium">{selectedProfile.address}</p>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    Achievements
                  </h4>
                  {selectedProfile.achievements?.length > 0 ? (
                    <div className="space-y-3">
                      {selectedProfile.achievements.map(
                        (achievement, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg"
                          >
                            <p className="font-medium">{achievement.type}</p>
                            <p className="text-gray-600">
                              {achievement.description}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {achievement.year}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No achievements recorded</p>
                  )}
                </div>

                {/* Certificates */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    Certificates
                  </h4>
                  {selectedProfile.certificates?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProfile.certificates.map(
                        (certificate, index) => (
                          <a
                            key={index}
                          href={`${process.env.REACT_APP_API_URL}/uploads/${certificate}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between transition-colors"
                        >
                          <span>Certificate #{index + 1}</span>
                          <FiDownload className="text-gray-500" />
                        </a>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No certificates available</p>
                  )}
                </div>
              </div>
            )}

            <div className="p-6 border-t border-gray-100">
              <button
                onClick={() => setSelectedProfile(null)}
                className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
