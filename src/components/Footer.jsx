import React from "react";
import footerLogo from "../assets/footer-logo.svg";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTwitter,
} from "react-icons/fa";

import { motion } from "framer-motion";
import { fadeIn } from "../utils/animationVarience";

const Footer = () => {
  return (
    <motion.div
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView={"show"}
      viewport={{ once: false, amount: 0.7 }}
      className="py-6 bg-gray-100 px-8"
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-8">
        <div className="space-y-6 mr-14">
          <div className="flex items-center space-x-2">
            <img src={footerLogo} alt="footer image" className="w-32 h-auto" />
          </div>
          <p className="text-para">
            A secure platform for Chuka University students to book health
            appointments, access wellness resources, and stay updated on health
            services.
          </p>

          <div className="flex space-x-4">
            <a
              href="#"
              className="hg-gray-200 text-primary rounded-full size-10 flex items-center justify-center hover:bg-primary hover:text-white"
            >
              <FaFacebookF className="text-4xl" />
            </a>

            <a
              href="#"
              className="hg-gray-200 text-primary rounded-full size-10 flex items-center justify-center hover:bg-primary hover:text-white"
            >
              <FaTwitter className="text-4xl" />
            </a>

            <a
              href="#"
              className="hg-gray-200 text-primary rounded-full size-10 flex items-center justify-center hover:bg-primary hover:text-white"
            >
              <FaInstagram className="text-4xl" />
            </a>

            <a
              href="#"
              className="hg-gray-200 text-primary rounded-full size-10 flex items-center justify-center hover:bg-primary hover:text-white"
            >
              <FaLinkedin className="text-4xl" />
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <a href="#home" className="hover:underline text-gray-700">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:underline text-gray-700">
                About
              </a>
            </li>
            <li>
              <a href="#services" className="hover:underline text-gray-700">
                Health Services
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:underline text-gray-700">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">Support</h3>
          <ul className="space-y-3">
            <li>
              <a href="#faq" className="hover:underline text-gray-700">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline text-gray-700">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline text-gray-700">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline text-gray-700">
                Help Center
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" />
              <p className="text-gray-700">Chuka University, Chuka, Kenya</p>
            </li>

            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-primary" />
              <p className="text-gray-700">+254 710 795 876</p>
            </li>

            <li className="flex items-center gap-2">
              <FaEnvelope className="text-primary" />
              <p className="text-gray-700">support@chukahealthservices.ac.ke</p>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default Footer;
