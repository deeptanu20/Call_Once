/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getProviderServices } from "../services/serviceService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CalendarIcon,
  PencilIcon,
  PlusCircle,
  Image as ImageIcon,
  X,
} from "lucide-react";

const ServiceProviderDashboard = () => {
  const [services, setServices] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { authData, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!authData || !authData.token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(authData.token);
      getProviderServices(decodedToken.id)
        .then((servicesData) => {
          setServices(servicesData);
        })
        .catch((error) => {
          console.error("Error fetching services:", error);
          if (error.response?.status === 401) {
            navigate("/login");
          }
        });
    } catch (error) {
      console.error("Error decoding token:", error);
      navigate("/login");
    }
  }, [authData, loading, navigate]);

  const handleEditService = (service) => {
    navigate(`/service-form/${service._id}`);
  };

  const handleViewBookings = (serviceId) => {
    navigate(`/bookings/${serviceId}`);
  };

  // Image Modal Component
  const ImageModal = ({ imageUrl, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={imageUrl}
          alt="Enlarged view"
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );

  // Image Gallery Component
  const ImageGallery = ({ images }) => {
    if (!images || images.length === 0) return null;

    return (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <ImageIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            Service Images
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className="relative group aspect-square overflow-hidden rounded-lg hover:ring-2 hover:ring-blue-500 transition-all"
            >
              <img
                src={image}
                alt={`Booking image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Your Services</h2>
        <button
          onClick={() => navigate("/service-form")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add New Service
        </button>
      </div>
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={service.icon || "/PlumberLogo.jpg"}
                    alt={`${service.name} icon`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.name}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-green-600">
                  &#8377;{service.price}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    service.availability === "Available"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {service.availability}
                </span>
              </div>
              {/* Add Image Gallery */}
              {service.images && service.images.length > 0 && (
                <ImageGallery images={service.images} />
              )}

              <div className="flex pt-4 justify-between">
                <button
                  onClick={() => handleEditService(service)}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
                >
                  <PencilIcon className="w-5 h-5 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleViewBookings(service._id)}
                  className="flex items-center text-purple-600 hover:text-purple-800 transition-colors duration-300"
                >
                  <CalendarIcon className="w-5 h-5 mr-1" />
                  View Bookings
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
