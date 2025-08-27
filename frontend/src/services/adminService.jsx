/* eslint-disable no-useless-catch */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Replace with your backend URL

// Get all services
export const getServices = async () => {
  try {
    const response = await axios.get(`${API_URL}/services`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all users
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/users`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getServiceProvider = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/service-providers`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all bookings
export const getBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/bookings`);
    return response.data;
  } catch (error) {
    throw error;
  }
};