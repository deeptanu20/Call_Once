import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCategories } from "../../services/categoryService";
import { 
  addService, 
  updateService, 
  getServiceById, 
  deleteServiceImages,
  deleteServiceIcon 
} from "../../services/serviceService";
import ServiceForm from "../adminComponents/ServiceForm";
import toast from 'react-hot-toast';

const ServiceFormPage = () => {
  const { serviceId } = useParams();
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    availability: "Available",
    icon: null,
    existingIcon: null,
    images: [],
    existingImages: []
  });
  const [categories, setCategories] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authData, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        if (serviceId) {
          const serviceData = await getServiceById(serviceId);
          setNewService({
            name: serviceData.name,
            description: serviceData.description,
            price: serviceData.price,
            category: serviceData.category,
            availability: serviceData.availability,
            icon: null,
            existingIcon: serviceData.icon || null,
            images: [],
            existingImages: serviceData.images || []
          });
          setEditingService(serviceData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load service data");
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && authData?.token) {
      fetchData();
    } else if (!authLoading && !authData?.token) {
      navigate("/login");
    }
  }, [serviceId, authData, authLoading, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService((prevService) => ({
      ...prevService,
      [name]: value,
    }));
  };

  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewService(prev => ({
        ...prev,
        icon: file
      }));
    }
  };
  
  const handleRemoveIcon = async () => {
    try {
      if (editingService && newService.existingIcon) {
        await deleteServiceIcon(serviceId);
        setNewService(prev => ({
          ...prev,
          existingIcon: null,
          icon: null
        }));
        toast.success("Icon removed successfully!");
      } else {
        setNewService(prev => ({
          ...prev,
          icon: null
        }));
      }
    } catch (error) {
      console.error("Error removing icon:", error);
      toast.error("Failed to remove icon");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = files.length + newService.existingImages.length;
    
    if (totalImages > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setNewService(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5 - prev.existingImages.length)
    }));
  };

  const handleRemoveExistingImage = async (imageUrl) => {
    try {
      if (editingService) {
        await deleteServiceImages(serviceId, [imageUrl]);
        setNewService(prev => ({
          ...prev,
          existingImages: prev.existingImages.filter(img => img !== imageUrl)
        }));
        toast.success("Image deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleRemoveNewImage = (index) => {
    setNewService(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(
      editingService ? "Updating service..." : "Adding service..."
    );

    try {
      const totalImages = newService.images.length + newService.existingImages.length;
      if (totalImages > 5) {
        toast.error("Maximum 5 images allowed", { id: loadingToast });
        return;
      }
      if (editingService) {
        await updateService(serviceId, newService);
        toast.success("Service updated successfully!", { id: loadingToast });
      } else {
        await addService(newService);
        toast.success("Service added successfully!", { id: loadingToast });
      }

      navigate("/provider/dashboard");
    } catch (error) {
      console.error("Error handling service:", error);
      toast.error(
        error.response?.data?.message || "Failed to save service",
        { id: loadingToast }
      );
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/provider/dashboard")}
          className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Dashboard
        </button>

        <ServiceForm
          newService={newService}
          categories={categories}
          editingService={editingService}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleImageUpload={handleImageUpload}
          handleRemoveExistingImage={handleRemoveExistingImage}
          handleRemoveNewImage={handleRemoveNewImage}
          handleIconUpload={handleIconUpload}
          handleRemoveIcon={handleRemoveIcon}
        />
      </div>
    </div>
  );
};

export default ServiceFormPage;