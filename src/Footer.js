import React from "react";
import { Link } from "react-router-dom";
import {
  FaWhatsapp,
  FaRegNewspaper,
  FaHandsHelping,
  FaPhoneVolume,
  FaMapMarkedAlt,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import logo from "./assets/bamroda_logo.png";

const Footer = () => {
  return (
    <footer className="bg-green-900 text-gray-100 border-t-4 border-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Village Identity Section */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img
                src={logo}
                alt="Gram Panchayat Logo"
                className="h-20 w-auto mb-4"
              />
            </Link>
            <p className="text-sm leading-relaxed text-green-50">
              Empowering rural communities through transparent governance and
              sustainable development.
            </p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Office Hours</h3>
              <p className="text-sm">Mon-Sat: 9 AM - 5 PM</p>
              <p className="text-sm">Sunday: Emergency Only</p>
            </div>
          </div>

          {/* Quick Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Essential Services</h3>
            <nav className="space-y-2">
              <Link
                to="/certificates"
                className="flex items-center hover:text-green-300 transition-colors"
              >
                <FaHandsHelping className="mr-2" />
                Document Services
              </Link>
              <Link
                to="/complaints"
                className="flex items-center hover:text-green-300 transition-colors"
              >
                <FaRegNewspaper className="mr-2" />
                Grievance Portal
              </Link>
              <Link
                to="/development-projects"
                className="flex items-center hover:text-green-300 transition-colors"
              >
                <FaMapMarkedAlt className="mr-2" />
                Development Projects
              </Link>
            </nav>
          </div>

          {/* Contact Block */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Immediate Connect</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <FaPhoneVolume className="mr-2 text-green-300" />
                <div>
                  <p className="font-medium">Emergency</p>
                  <a
                    href="tel:+911234567890"
                    className="text-sm hover:underline"
                  >
                    +91 12345 67890
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <FaWhatsapp className="mr-2 text-green-300" />
                <div>
                  <p className="font-medium">WhatsApp Help</p>
                  <a
                    href="https://wa.me/911234567890"
                    className="text-sm hover:underline"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <FaEnvelopeOpenText className="mr-2 text-green-300" />
                <a
                  href="mailto:contact@bamroda.org"
                  className="hover:underline text-sm"
                >
                  contact@bamroda.org
                </a>
              </div>
            </div>
          </div>

          {/* Government Partners */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Government Links</h3>
            <nav className="grid grid-cols-1 gap-2 text-sm">
              <a
                href="https://pmindia.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-300 transition-colors"
              >
                PMO India
              </a>
              <a
                href="https://rural.nic.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-300 transition-colors"
              >
                Ministry of Rural Development
              </a>
              <a
                href="https://swachhbharatmission.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-300 transition-colors"
              >
                Swachh Bharat Mission
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              <button
                type="button"
                className="text-green-300 hover:text-white transition-colors bg-transparent border-0 p-0 cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                className="text-green-300 hover:text-white transition-colors bg-transparent border-0 p-0 cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
            <p className="text-sm text-green-200 text-center">
              © {new Date().getFullYear()} Bamroda Panchayat.
              <br className="md:hidden" /> Developed for community welfare.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
