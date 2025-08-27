import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Helper function to create FormData with images
const createReviewFormData = (reviewData, images) => {
  const formData = new FormData();
  
  // Append review data
  Object.keys(reviewData).forEach(key => {
    formData.append(key, reviewData[key]);
  });
  
  // Append images (limit to 5)
  const imagesToUpload = Array.from(images || []).slice(0, 5);
  imagesToUpload.forEach(image => {
    formData.append('images', image);
  });
  
  return formData;
};

// Fetch reviews for a service
export const getReviewsForService = async (serviceId) => {
  try {
    const response = await axios.get(`${API_URL}/reviews/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching reviews' };
  }
};

// Post a new review with images
export const postReview = async (serviceId, reviewData, images) => {
  try {
    const formData = createReviewFormData(
      { service: serviceId, ...reviewData },
      images
    );

    const response = await axios.post(`${API_URL}/reviews/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error posting review' };
  }
};

// Update a review with images
export const updateReview = async (reviewId, updatedReviewData, newImages, deletedImages) => {
  try {
    const formData = createReviewFormData(updatedReviewData, newImages);
    
    // Add deleted images if any
    if (deletedImages && deletedImages.length > 0) {
      formData.append('deletedImages', JSON.stringify(deletedImages));
    }

    const response = await axios.put(`${API_URL}/reviews/${reviewId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating review' };
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(`${API_URL}/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error deleting review' };
  }
};

// Get image upload validation rules
export const getImageUploadRules = () => {
  return {
    maxImages: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    maxSizeInMB: 10,
  };
};

// Validate images before upload
export const validateImages = (images) => {
  const rules = getImageUploadRules();
  const errors = [];

  if (images.length > rules.maxImages) {
    errors.push(`Maximum ${rules.maxImages} images allowed`);
  }

  Array.from(images).forEach(image => {
    if (!rules.allowedTypes.includes(image.type)) {
      errors.push(`Invalid file type: ${image.name}. Only JPG and PNG allowed`);
    }

    const sizeInMB = image.size / (1024 * 1024);
    if (sizeInMB > rules.maxSizeInMB) {
      errors.push(`File too large: ${image.name}. Maximum size is ${rules.maxSizeInMB}MB`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};
