/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingsByServiceId } from "../services/serviceProviderService";
import { updateBookingStatus } from "../services/bookingService";
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Calendar, Clock, Phone, MapPin, User, Image as ImageIcon, X } from 'lucide-react';

const ServiceBookings = () => {
  const { serviceId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const { authData, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookingsByServiceId(serviceId);
        setBookings(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        toast.error('Failed to fetch bookings. Please try again.');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (authLoading) return;

    if (!authData || !authData.token) {
      navigate('/login');
      return;
    }

    fetchBookings();
  }, [serviceId, authData, authLoading, navigate]);

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const loadingToast = toast.loading('Updating booking status...');
    setUpdatingStatus(bookingId);
    
    try {
      await updateBookingStatus(bookingId, newStatus);
      
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      
      toast.success('Booking status updated successfully!', {
        id: loadingToast,
      });
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast.error('Failed to update booking status.', {
        id: loadingToast,
      });
      
      const originalBooking = bookings.find(b => b._id === bookingId);
      if (originalBooking) {
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking._id === bookingId
              ? { ...booking, status: originalBooking.status }
              : booking
          )
        );
      }
      
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusBorderColor = (status) => {
    const colors = {
      completed: 'border-green-200',
      cancelled: 'border-red-200',
      confirmed: 'border-blue-200',
      pending: 'border-yellow-200'
    };
    return colors[status] || 'border-gray-200';
  };

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

  // Image Gallery component
  const ImageGallery = ({ images }) => {
    if (!images || images.length === 0) return null;

    return (
      <div className="mt-4 border-t pt-4">
        <div className="flex items-center gap-2 mb-3">
          <ImageIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Booking Images</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className="relative group aspect-square overflow-hidden rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Service Bookings</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your service bookings and their statuses</p>
      </div>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">No Bookings Found</h3>
          <p className="text-sm sm:text-base text-gray-600">There are currently no bookings for this service.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border-2 ${getStatusBorderColor(booking.status)}`}
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Booking ID</p>
                    <h3 className="text-sm sm:text-lg font-medium text-gray-800 break-all">{booking._id}</h3>
                  </div>
                  <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(booking.status)} self-start`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm sm:text-base text-gray-700">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-400 flex-shrink-0" />
                    <span className="font-medium truncate">{booking.user.name}</span>
                  </div>

                  <div className="flex items-center text-sm sm:text-base text-gray-700">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Scheduled Date</p>
                      <p>{new Date(booking.scheduledDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm sm:text-base text-gray-700">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Scheduled Time</p>
                      <p>{new Date(booking.scheduledDate).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start text-sm sm:text-base text-gray-700">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="break-words">{booking.address}</span>
                  </div>

                  <div className="flex items-center text-sm sm:text-base text-gray-700">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-400 flex-shrink-0" />
                    <span>{booking.phone}</span>
                  </div>
                </div>

                {/* Add Image Gallery */}
                {booking.images && booking.images.length > 0 && (
                  <ImageGallery images={booking.images} />
                )}

                <div className="mt-6 pt-4 border-t">
                  <label htmlFor={`status-${booking._id}`} className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Update Booking Status
                  </label>
                  <select
                    id={`status-${booking._id}`}
                    value={booking.status}
                    onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                    disabled={updatingStatus === booking._id}
                    className="w-full py-1.5 sm:py-2 px-2 sm:px-3 text-sm border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceBookings;