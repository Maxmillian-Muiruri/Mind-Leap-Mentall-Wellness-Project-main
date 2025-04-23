import React, { useState } from 'react';
import { User, Mail, Calendar, Clock, Clipboard, Smartphone, IdCard } from 'lucide-react';

const AppointmentBooking = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    date: '',
    time: '09:00',
    service: 'Health Consultation',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ text: '', isError: false });

  const services = [
    'Health Consultation',
    'Mental Health Counseling',
    'Academic Guidance',
    'Emergency Services',
    'Vaccination'
  ];

  // Generate time slots (9AM-5PM in 30-minute increments)
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';
    return hour <= 17 ? `${hour.toString().padStart(2, '0')}:${minutes}` : null;
  }).filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ text: '', isError: false });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Unauthorized');
      }

      // Validate inputs
      if (!/^EDS\d\/\d{5}\/\d{2}$/.test(formData.studentId)) {
        throw new Error('Invalid student ID format: EDS1/69962/22');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Invalid university email address');
      }

      if (!/^\+?[\d\s-]{10,15}$/.test(formData.phone)) {
        throw new Error('Invalid phone number format: +254700123456');
      }

      if (!formData.date) {
        throw new Error('Please select a date');
      }

      // Date validation
      const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
      if (selectedDateTime < new Date()) {
        throw new Error('Appointment date/time must be in the future');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          appointmentDateTime: selectedDateTime.toISOString()
        }),
        signal: controller.signal
      });

      const contentType = response.headers.get('content-type');
      const responseData = contentType?.includes('application/json') 
        ? await response.json()
        : { message: await response.text() };

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      // Reset form
      setFormData({
        fullName: '',
        studentId: '',
        email: '',
        phone: '',
        date: '',
        time: '09:00',
        service: 'Health Consultation',
        notes: ''
      });

      setSubmitMessage({
        text: responseData.message || 'Appointment booked successfully!',
        isError: false
      });

    } catch (error) {
      console.error('Booking error:', error);
      let errorMessage = 'Failed to book appointment. Please try again.';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Check your connection.';
      } else if (error.message.includes('Unauthorized')) {
        errorMessage = 'Please login to book appointments';
      } else if (error.message.includes('Validation')) {
        errorMessage = `Invalid data: ${error.message}`;
      } else if (error.message.includes('ETIMEDOUT')) {
        errorMessage = 'Connection to server failed';
      }

      setSubmitMessage({ 
        text: errorMessage, 
        isError: true 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentIdChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (value.length > 4) value = `${value.slice(0,4)}/${value.slice(4)}`;
    if (value.length > 10) value = `${value.slice(0,10)}/${value.slice(10,12)}`;
    
    setFormData(prev => ({ ...prev, studentId: value.slice(0, 13) }));
  };

  return (
    <section id="book-appointment" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">University Health Services Booking</h2>
          <p className="text-gray-600">Schedule your appointment with campus health professionals</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-5">
          {/* Student Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student ID * <span className="text-xs text-gray-500">(EDS1/69962/22)</span>
              </label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleStudentIdChange}
                  pattern="^EDS\d\/\d{5}\/\d{2}$"
                  title="Enter your student ID in format: EDS1/69962/22"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="EDS1/69962/22"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="student@university.ac.ke"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="^\+?[\d\s-]{10,15}$"
                  title="Valid formats: +254700123456 or 0700123456"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="+254700123456"
                />
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  required
                >
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service *</label>
              <div className="relative">
                <Clipboard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  required
                >
                  {services.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Symptoms/Reason for Visit <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your symptoms or reason for appointment..."
            />
          </div>

          {/* Submit Button and Status Message */}
          {submitMessage.text && (
            <div className={`p-3 rounded-md ${submitMessage.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {submitMessage.text}
              {submitMessage.isError && (
                <button
                  onClick={handleSubmit}
                  className="ml-2 text-sm underline hover:text-blue-600"
                  disabled={isSubmitting}
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 mt-4 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Confirm Health Appointment'
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AppointmentBooking;