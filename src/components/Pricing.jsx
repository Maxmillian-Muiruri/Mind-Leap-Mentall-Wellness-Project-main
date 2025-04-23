// eslint-disable-next-line no-unused-vars
import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/animationVarience";

const packages = [
  {
    name: "Bronze Package",
    price: "$99",
    description:
      "Ideal for individuals or small businesses looking to get started with mental wellness.",
    features: [
      "Access to basic wellness resources",
      "Weekly mental wellness tips",
      "Community support group access",
    ],
  },
  {
    name: "Silver Package",
    price: "$199",
    description:
      "A great choice for growing businesses with additional features and support for mental wellness.",
    features: [
      "All Bronze Package features",
      "Monthly guided meditation sessions",
      "Personalized wellness plan",
      "Access to expert webinars",
    ],
  },
  {
    name: "Gold Package",
    price: "$299",
    description:
      "Perfect for larger businesses needing advanced mental wellness features and premium support.",
    features: [
      "All Silver Package features",
      "Weekly one-on-one coaching sessions",
      "Advanced mental wellness tracking tools",
      "24/7 access to mental wellness experts",
    ],
  },
];

const Pricing = () => {
  const handleScrollToContact = () => {
    const targetElement = document.getElementById("contact");
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView={"show"}
      viewport={{ once: false, amount: 0.7 }}
      id="pricing"
      className="bg-[#f7f8fc] pt-32 pb-16"
    >
      <div className="container mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-secondary mb-3">
            Perfect for Small & Large Brands
          </h2>
          <p className="text-lg mb-12 md:w-2/3 mx-auto text-gray-600">
            Choose the package that best suits your needs and take the first
            step toward better mental wellness.
          </p>
        </div>

        {/* Packages */}
        <div className="flex flex-col md:w-5/6 mx-auto md:flex-row gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 flex-1 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              <h3 className="text-2xl font-semibold mb-4 text-primary">
                {pkg.name}
              </h3>
              <hr className="w-24 border-primary border-2 mb-4" />
              <p className="text-3xl font-bold mb-4">
                {pkg.price}{" "}
                <span className="text-lg font-normal text-gray-500">/mo</span>
              </p>
              <p className="text-lg mb-6 text-gray-700">{pkg.description}</p>
              <ul className="list-disc list-inside space-y-2 mb-6 text-gray-600">
                {pkg.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <button
                onClick={handleScrollToContact}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-300"
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Pricing;
