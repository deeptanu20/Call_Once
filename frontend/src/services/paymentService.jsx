import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;// Replace with your backend URL

// Process a payment
export const processPayment = async (userId, amount) => {
  try {
    const response = await axios.post(`${API_URL}/payments`, { userId, amount });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get payment history
export const getPaymentHistory = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/payments/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
