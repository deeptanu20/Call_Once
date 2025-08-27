/* eslint-disable no-useless-catch */
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Replace with your backend URL

// Get all services
export const getServices = async () => {
  try {
    const response = await axios.get(`${API_URL}/services`);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get service by ID
export const getServiceById = async (serviceId) => {
  try {
    const response = await axios.get(`${API_URL}/services/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add a new service with images
export const addService = async (serviceData) => {
  try {
    const formData = new FormData();
    
    // Add basic service details
    Object.keys(serviceData).forEach(key => {
      if (key !== 'images'&& key !== 'icon') {
        formData.append(key, serviceData[key]);
      }
    });

    // Add icon if provided
    if (serviceData.icon) {
      formData.append('icon', serviceData.icon);
    }
    
    // Add images
    if (serviceData.images) {
      serviceData.images.forEach(image => {
        formData.append('images', image);
      });
    }

    const response = await axios.post(`${API_URL}/services`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update service with images
export const updateService = async (serviceId, serviceData) => {
  try {
    const formData = new FormData();
    
    // Add basic service details
    Object.keys(serviceData).forEach(key => {
      if (key !== 'images' && key !== 'icon') {
        formData.append(key, serviceData[key]);
      }
    });

    // Add new icon if provided
    if (serviceData.icon) {
      formData.append('icon', serviceData.icon);
    }
    
    // Add new images
    if (serviceData.images) {
      serviceData.images.forEach(image => {
        formData.append('images', image);
      });
    }

    const response = await axios.put(`${API_URL}/services/${serviceId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a service
export const deleteService = async (serviceId) => {
  try {
    const response = await axios.delete(`${API_URL}/services/${serviceId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete service images
export const deleteServiceImages = async (serviceId, imageUrls) => {
  try {
    const response = await axios.delete(`${API_URL}/services/${serviceId}/images`, {
      data: { imageUrls }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete service icon
export const deleteServiceIcon = async (serviceId) => {
  try {
    const response = await axios.delete(`${API_URL}/services/${serviceId}/icon`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get services by provider ID
export const getProviderServices = async (providerId) => {
  try {
    const response = await axios.get(`${API_URL}/services/provider/${providerId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchServiceByName = async (serviceName) => {
  try {
    const response = await axios.get(`${API_URL}/services/search`, {
      params: { name: serviceName }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServicesByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/services/category/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};