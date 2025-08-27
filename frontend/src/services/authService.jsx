import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

export const loginService = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token } = response.data;
    
    // Store token in a cookie
    Cookies.set("authData", JSON.stringify({ token }), { expires: 7 });

    // Set the Authorization header for all future requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return { token, response };
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const registerService = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const logoutService = () => {
  Cookies.remove("authData"); // Clear the auth cookies
  delete axios.defaults.headers.common["Authorization"]; // Clear axios headers
};

export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('profilePicture', file);

  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(`${API_URL}/auth/upload-profile-picture`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload profile picture');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};