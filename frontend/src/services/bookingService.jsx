/* eslint-disable no-useless-catch */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Replace with your backend URL

// Create a new booking with images
export const createBooking = async (bookingData) => {
  try {
    const formData = new FormData();
    
    // Append booking details
    formData.append('service', bookingData.service);
    formData.append('scheduledDate', bookingData.scheduledDate);
    formData.append('address', bookingData.address);
    formData.append('phone', bookingData.phone);
    
    // Append images if they exist
    if (bookingData.images) {
      Array.from(bookingData.images).forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await axios.post(`${API_URL}/bookings`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add images to existing booking
export const addBookingImages = async (bookingId, images) => {
  try {
    const formData = new FormData();
    Array.from(images).forEach((image) => {
      formData.append('images', image);
    });

    const response = await axios.post(`${API_URL}/bookings/${bookingId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete booking image
export const deleteBookingImage = async (bookingId, imageIndex) => {
  try {
    const response = await axios.delete(`${API_URL}/bookings/${bookingId}/images/${imageIndex}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all bookings by id (with optional pagination and status filter)
export const getBookings = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/bookings/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update booking details
export const updateBooking = async (bookingId, updates) => {
  try {
    const response = await axios.put(`${API_URL}/bookings/${bookingId}`, updates);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a booking
export const deleteBooking = async (bookingId) => {
  try {
    const response = await axios.delete(`${API_URL}/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await axios.patch(`${API_URL}/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch bookings for admin (includes all bookings)
export const fetchAllBookingsForAdmin = async () => {
  try {
    const response = await axios.get(`${API_URL}/bookings/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};