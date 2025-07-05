import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";

const BirthdayWishes = () => {
  const [birthdayVillagers, setBirthdayVillagers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/birthdays`)
      .then((res) => res.json())
      .then((data) => setBirthdayVillagers(data))
      .catch((err) => console.error("Error fetching birthdays:", err));
  }, []);

  if (birthdayVillagers.length === 0) {
    return null; // Hide component when no birthdays are available.
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto my-6 max-w-xl p-4 bg-white border border-gray-200 rounded-md shadow-sm"
    >
      {/* Title */}
      <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
        🎉 આજે જન્મદિવસ છે 🎂
      </h2>

      {/* Multiple Birthday Wishes via Slider */}
      {birthdayVillagers.length > 1 ? (
        <Slider
          autoplay
          infinite
          arrows={false}
          dots={true}
          className="mx-auto"
        >
          {birthdayVillagers.map((villager) => (
            <div key={villager._id} className="px-3 py-2">
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center text-base font-medium text-gray-700 bg-gray-100 py-3 px-4 rounded"
              >
                🎈 {villager.surname} {villager.name} {villager.fatherName} ને
                જન્મદિવસની શુભકામનાઓ! 🎉
              </motion.div>
            </div>
          ))}
        </Slider>
      ) : (
        // Single Birthday Wish
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center text-base font-medium text-gray-700 bg-gray-100 py-3 px-4 rounded"
        >
          🎈 {birthdayVillagers[0].surname} {birthdayVillagers[0].name}{" "}
          {birthdayVillagers[0].fatherName} ને જન્મદિવસની શુભકામનાઓ! 🎉
        </motion.div>
      )}
    </motion.div>
  );
};

export default BirthdayWishes;
