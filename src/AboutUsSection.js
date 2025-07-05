import React from "react";
import { Link } from "react-router-dom";
import {
  FaTractor,
  FaBook,
  FaHandHoldingWater,
  FaMonument,
} from "react-icons/fa";
import { motion } from "framer-motion";

const facilities = [
  {
    title: "Organic Farming",
    icon: <FaTractor className="w-8 h-8" />,
    link: "/farming",
    bg: "bg-green-100",
  },
  {
    title: "Village School",
    icon: <FaBook className="w-8 h-8" />,
    link: "/education",
    bg: "bg-blue-100",
  },
  {
    title: "Clean Water",
    icon: <FaHandHoldingWater className="w-8 h-8" />,
    link: "/water",
    bg: "bg-cyan-100",
  },
  {
    title: "Heritage Sites",
    icon: <FaMonument className="w-8 h-8" />,
    link: "/heritage",
    bg: "bg-amber-100",
  },
];

const AboutUsSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-green-200 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-200 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-12 items-start"
        >
          {/* Left Content */}
          <div className="w-full lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200"
            >
              <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">
                Since 1947
              </p>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Welcome to <span className="text-green-700">Bamroda Village</span>
            </h2>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Nestled in the foothills of the Western Ghats, our village is a
              harmonious blend of tradition and progress. With lush green
              fields, ancient banyan trees, and a close-knit community of 1200
              residents, we preserve our cultural heritage while embracing
              sustainable development.
            </p>

            {/* Village Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { number: "1200+", label: "Residents" },
                { number: "85%", label: "Farmland" },
                { number: "1947", label: "Established" },
                { number: "50+", label: "Local Businesses" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 text-center"
                >
                  <p className="text-2xl font-bold text-green-700">
                    {stat.number}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.02 }} className="inline-block">
              <Link
                to="/about"
                className="mt-8 inline-flex items-center px-8 py-4 bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:bg-green-800 group"
              >
                Explore Our Village
                <span className="ml-3 group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Facility Cards */}
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {facilities.map((facility, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={facility.link}
                  className={`${facility.bg} group relative flex flex-col items-center p-8 rounded-2xl shadow-md border border-gray-200 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden`}
                >
                  {/* Hover Effect Elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0.5 border-2 border-white/20 rounded-2xl" />

                  <div className="mb-6 text-green-700 group-hover:text-green-800 transition-colors">
                    {facility.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 text-center">
                    {facility.title}
                  </h3>

                  {/* Animated Underline */}
                  <div className="mt-4 w-12 h-1 bg-green-700 rounded-full transform group-hover:scaleX-125 origin-left transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-blue-200 rounded-full blur-3xl opacity-30 -z-10" />
      </div>
    </section>
  );
};

export default AboutUsSection;
