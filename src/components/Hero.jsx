import React from "react";
import heroImg from "../assets/hero.webp";
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/animationVarience";
const Hero = () => {
  return (
    <section
      id="Home"
      className="bg-heroBg text-white flex items-center pt-28 md:h-screen "
    >
      <div 
      
      
      
      className="container mx-auto flex flex-col md:flex-row items-center justify-between p-8 overflow-y-hiden gap-12 h-full">
        {/* left side */}

        <motion.div 
        
        variants={fadeIn("down", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.7 }}
        
        className="md:w-1/2">
          <h1 className="text-4xl font-secondary font-bold mb-4 md:w-3/5 leading-snug">
            Empowering Students with Health & Counseling Services
          </h1>
          <p className="text-lg mb-12 md:pr-8">
            Our platform provides a seamless way for students to book health and
            counseling appointments, access wellness resources, and receive
            timely support. With a focus on confidentiality, efficiency, and
            accessibility, we ensure students get the care they need for a
            balanced and healthier university experience.
          </p>
          <button className="bg-primary text-white py-3.5 px-8 font-medium rounded-md hover:bg-primary/90">
            <a href="#contact" className="flex gap-1 items-center">
              <span>Get Started</span>
              <IoArrowForwardCircleSharp />
            </a>
          </button>
        </motion.div>
        {/* right side*/}

        <motion.div 

        variants={fadeIn("left", 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.7 }}
        
        className="md:w-1/2 h-full flex items-center justify-center">
          <img
            src={heroImg}
            alt="hero image"
            className="w-full max-h-[534px] object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
