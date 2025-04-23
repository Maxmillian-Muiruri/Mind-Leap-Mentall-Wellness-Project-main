import React, { useEffect, useState } from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => { 
  const { user, logout } = useAuth() || {};
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  const handleScroll = () => {
    const sections = ["Home", "services", "about", "pricing", "book-appointment", "testimonial"];
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        const offsetTop = element.offsetTop;
        const height = element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
          setActiveSection(section);
        }
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollTo = (targetId) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const navLinks = (
    <ul className="font-medium flex flex-col md:flex-row lg:space-x-8 sm:space-x-4 space-y-2 md:space-y-0 p-4 md:p-0">
      <li>
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            handleCloseMenu();
            handleScrollTo("Home");
          }}
          href="#Home"
          className={`text-white ${activeSection === "Home" ? "isActive" : ""}`}
        >
          Home
        </motion.a>
      </li>

      <li>
        <motion.a
          href="#services"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            handleCloseMenu();
            handleScrollTo("services");
          }}
          className={`text-white ${activeSection === "services" ? "isActive" : ""}`}
        >
          Services
        </motion.a>
      </li>

      <li>
        <motion.a
          href="#about"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            handleCloseMenu();
            handleScrollTo("about");
          }}
          className={`text-white ${activeSection === "about" ? "isActive" : ""}`}
        >
          About Us
        </motion.a>
      </li>

      <li>
        <motion.a
          href="#pricing"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            handleCloseMenu();
            handleScrollTo("pricing");
          }}
          className={`text-white ${activeSection === "pricing" ? "isActive" : ""}`}
        >
          Pricing
        </motion.a>
      </li>

      <li>
        <motion.a
          href="#testimonial"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            handleCloseMenu();
            handleScrollTo("testimonial");
          }}
          className={`text-white ${activeSection === "testimonial" ? "isActive" : ""}`}
        >
          Testimonial
        </motion.a>
      </li>
     
      <li>
        <motion.a
          href="#book-appointment"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            handleCloseMenu();
            handleScrollTo("book-appointment");
          }}
          className={`text-white ${activeSection === "book-appointment" ? "isActive" : ""}`}
        >
          Book Now
        </motion.a>
      </li>
    </ul>
  );

  return (
    <header className="bg-heroBg text-white py-6 px-4 fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex justify-between items-center h-full">
        {/* Logo */}
        <div className="text-white text-lg font-semibold">
          <Link to="/">
            <img src="/logo.svg" alt="logo" />
          </Link>
        </div>

        {/* Nav items */}
        <div className="hidden md:flex flex-grow justify-center">
          <nav>{navLinks}</nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Contact Us Button */}
          <div className="hidden md:block">
            <a
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo("contact");
              }}
              href="#contact"
              className="text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded"
            >
              Contact Us
            </a>
          </div>

          {/* Auth Section */}
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm">Welcome, {user.role}</span>
              {user.isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={logout}
                className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:block">
              <Link
                to="/Login"
                className="text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded"
                aria-label="Login to your account"
              >
                Login
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="block md:hidden">
            <button
              onClick={handleToggle}
              className={`text-white focus:outline-none ${
                isOpen ? "border border-white" : ""
              }`}
            >
              <HiOutlineMenuAlt3 className="size-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="absolute top-full left-0 w-full bg-heroBg z-20 md:hidden">
          <ul className="flex flex-col p-4 space-y-3">
            {navLinks.props.children}
            <li className="py-2">
              <a
                href="#contact"
                className="text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded block text-center"
                onClick={(e) => {
                  e.preventDefault();
                  handleCloseMenu();
                  handleScrollTo("contact");
                }}
              >
                Contact Us
              </a>
            </li>
            
            {/* Mobile Auth Links */}
            {user ? (
              <>
                <li className="py-2 text-center text-white">
                  Welcome, {user.role}
                </li>
                {user.isAdmin && (
                  <li className="py-2">
                    <Link
                      to="/admin/dashboard"
                      onClick={handleCloseMenu}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded block text-center"
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                <li className="py-2">
                  <button
                    onClick={() => {
                      logout();
                      handleCloseMenu();
                    }}
                    className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded w-full"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="py-2">
                <Link
                  to="/login"
                  onClick={handleCloseMenu}
                  className="text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded block text-center"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;