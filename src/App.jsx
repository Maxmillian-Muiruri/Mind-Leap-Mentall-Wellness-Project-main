import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import About from "./components/About";
import Pricing from "./components/Pricing";
import Testimonial from "./components/Testimonial";
import WorkingStep from "./components/WorkingStep";
import Contact from "./components/contact";
import Footer from "./components/Footer";
import AppointmentBooking from "./components/AppointmentBooking";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/" />}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <div className="font-primary overflow-x-hidden">
            <Navbar />
            <Hero />
            <Services />
            <About />
            <WorkingStep />
            <Pricing />
            <Testimonial />
            <AppointmentBooking />
            <Contact />
            <Footer />
          </div>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
