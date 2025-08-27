/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServiceById } from "../services/serviceService";
import { getReviewsForService } from "../services/reviewService";
import ImageGallery from "./userComponents/ImageGallery";
import {X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Reviews from "./userComponents/Reviews";

const ImageModal = ({ image, onClose }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <div className="relative max-w-4xl max-h-[90vh] mx-4">
      <img
        src={image}
        alt="Enlarged view"
        className="max-w-full max-h-[85vh] object-contain"
      />
      <button
        onClick={onClose}
        className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <Loader2 className="h-4 w-4 animate-spin" />
    <span>Loading...</span>
  </div>
);

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const loadingToast = toast.loading("Loading service details...");
      try {
        const [serviceData, reviewsData] = await Promise.all([
          getServiceById(serviceId),
          getReviewsForService(serviceId),
        ]);
        const populatedReviews = reviewsData.map(review => ({
          ...review,
          user: review.user || { name: 'Unknown User' }
        }));

        setService(serviceData);
        setReviews(populatedReviews);
        toast.success("Service details loaded successfully", {
          id: loadingToast,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Unable to fetch service details", { id: loadingToast });
        setError("Unable to fetch data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  const handleBookNow = () => {
    navigate(`/booking-form?serviceId=${serviceId}`);
  };

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center font-semibold">{error}</div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!service) {
    return <div className="p-4 text-center">Service not found</div>;
  }

  return (
    <div className="w-full mx-auto px-4 md:px-8 lg:px-16 xl:px-32 py-6 md:py-12 bg-gray-50">
      {/* Service Header Section */}
      <div className="bg-white shadow-lg rounded-2xl p-4 md:p-8 mb-6 md:mb-8">
        <div className="flex items-start gap-6 mb-4">
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={service.icon || "/PlumberLogo.jpg"}
              alt={`${service.name} icon`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-gray-800">
              {service.name}
            </h1>
            <p className="text-base md:text-lg mb-4 md:mb-6 text-gray-600">
              {service.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-xl md:text-2xl font-semibold text-gray-800">
              ₹{service.price}
            </p>
            <p className="text-sm text-gray-500">
              Provided by: {service.providerName}
            </p>
          </div>
          <button
            onClick={handleBookNow}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Service Images Section */}
      {service.images && service.images.length > 0 && (
        <div className="bg-white shadow-lg rounded-2xl p-4 md:p-8 mb-6 md:mb-8">
          <ImageGallery images={service.images} />
        </div>
      )}

      {/* Reviews Section */}
      <Reviews
        serviceId={serviceId}
        reviews={reviews}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default ServiceDetails;