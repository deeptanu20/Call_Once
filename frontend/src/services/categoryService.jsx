import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Get All Categories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories/`);
    return response.data; // Assuming response contains an array of categories
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Create New Category (Admin Only)
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_URL}/categories/`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Update Category (Admin Only)
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await axios.put(`${API_URL}/categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete Category (Admin Only)
export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`${API_URL}/categories/${categoryId}`);
    return response.data; // Assuming it returns a success message
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
