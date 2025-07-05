import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaAward,
  FaCertificate,
  FaBirthdayCake,
  FaMobileAlt,
  FaHome,
  FaUser,
  FaCalendarDay,
} from "react-icons/fa";

function VillagerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/villager/${id}`
        );
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {profile ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="relative bg-gradient-to-r from-slate-800 to-slate-700 py-8 px-6">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Profile Photo */}
                {/* Profile Photo Container */}
                <div className="w-40 h-40 md:w-48 md:h-48 flex-shrink-0 border-4 border-white/20 rounded-full overflow-hidden shadow-xl">
                  {profile.photo ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${profile.photo}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <FaUser className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                </div>
                {/* Personal Info */}
                <div className="text-center md:text-left space-y-1 text-white">
                  <h1 className="text-2xl md:text-3xl font-bold font-serif tracking-tight">
                    {profile.surname} {profile.name} {profile.fatherName}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                    <InfoBadge
                      icon={<FaCalendarDay className="text-emerald-400" />}
                      label="Date of Birth"
                      value={profile.dob}
                    />
                    <InfoBadge
                      icon={<FaBirthdayCake className="text-emerald-400" />}
                      label="Age"
                      value={profile.age}
                    />
                    <InfoBadge
                      icon={<FaMobileAlt className="text-emerald-400" />}
                      label="Mobile"
                      value={profile.mobile}
                    />
                    <InfoBadge
                      icon={<FaHome className="text-emerald-400" />}
                      label="Address"
                      value={profile.address}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
              {/* Achievements */}
              <SectionCard
                title="Life Achievements"
                icon={<FaAward className="text-emerald-600" />}
              >
                {profile.achievements?.length > 0 ? (
                  <div className="space-y-3">
                    {profile.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="p-4 bg-slate-50 rounded-lg border-l-4 border-emerald-500"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-emerald-100 p-2 rounded-full">
                            <FaAward className="w-5 h-5 text-emerald-600" />
                          </span>
                          <h3 className="font-semibold text-slate-800">
                            {achievement.type}
                          </h3>
                        </div>
                        <p className="text-slate-600 text-sm">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          Year: {achievement.year}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No achievements recorded yet" />
                )}
              </SectionCard>

              {/* Certificates */}
              <SectionCard
                title="Official Documents"
                icon={<FaCertificate className="text-emerald-600" />}
              >
                {profile.certificates?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {profile.certificates.map((certificate, index) => (
                    <a
                      key={index}
                      href={`${process.env.REACT_APP_API_URL}/uploads/${certificate}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="bg-emerald-100 p-2 rounded-full">
                          <FaCertificate className="w-5 h-5 text-emerald-600" />
                        </span>
                        <span className="font-medium text-slate-700 text-sm group-hover:text-emerald-600">
                          Document {index + 1}
                        </span>
                      </div>
                      <span className="text-emerald-600 text-sm">View →</span>
                    </a>
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No documents available" />
                )}
              </SectionCard>
            </div>
          </div>
        ) : (
          <ErrorState message="Profile not found" />
        )}
      </div>
    </div>
  );
}

// Reusable Components
const InfoBadge = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
    <span className="text-emerald-400 text-sm">{icon}</span>
    <div>
      <span className="text-xs text-slate-200">{label}:</span>
      <span className="ml-1.5 font-medium text-white text-sm">{value}</span>
    </div>
  </div>
);

const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-4">
    <div className="flex items-center gap-2 mb-4">
      <span className="bg-emerald-100 p-2 rounded-lg">{icon}</span>
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
    </div>
    {children}
  </div>
);

const LoadingSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse space-y-8 w-full max-w-xl">
      <div className="h-48 bg-slate-200 rounded-xl" />
      <div className="space-y-4">
        <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto" />
        <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
        <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto" />
      </div>
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
    <div className="bg-red-50 p-6 rounded-xl max-w-md border border-red-100">
      <div className="text-red-600 text-4xl mb-3">⚠️</div>
      <h2 className="text-lg font-semibold text-red-800 mb-2">
        Profile Unavailable
      </h2>
      <p className="text-red-700 text-sm">{message}</p>
    </div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-center py-4">
    <p className="text-slate-500 text-sm italic">{message}</p>
  </div>
);

export default VillagerProfile;
