/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookings, updateBookingStatus } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { Image as ImageIcon, X } from 'lucide-react';

const BookingDetails = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const { authData, loading: authLoading, getUserIdFromToken } = useAuth();

  useEffect(() => {
    const fetchUserBookings = async (userId) => {
      try {
        const data = await getBookings(userId);
        setBookings(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Unable to fetch bookings.');
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
  
    try {
      const userId = getUserIdFromToken(authData.token);
      if (userId) {
        fetchUserBookings(userId);
      } else {
        setError('Invalid token. Please log in again.');
        navigate('/login');
      }
    } catch (error) {
      setError(error.message);
      navigate('/login');
    }
  }, [authData, authLoading, getUserIdFromToken, navigate]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, 'cancelled');
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
    } catch (err) {
      console.error('Error canceling booking:', err);
      setError('Unable to cancel booking. Please try again.');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
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
          <span className="text-sm font-medium text-gray-700">Booking Images</span>
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

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-500 text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-4">No Bookings Available</h2>
          <p className="text-gray-600">You haven&apos;t made any bookings yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Bookings</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.slice().reverse().map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{booking.service.name}</h2>
                <p className="text-gray-600 mb-4">{booking.service.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-green-600">${booking.service.price}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    booking.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : booking.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'confirmed'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Date:</span>{' '}
                    {new Date(booking.scheduledDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p><span className="font-semibold">Address:</span> {booking.address}</p>
                  <p><span className="font-semibold">Phone:</span> {booking.phone}</p>
                </div>

                {/* Add Image Gallery */}
                {booking.images && booking.images.length > 0 && (
                  <ImageGallery images={booking.images} />
                )}
              </div>
              
              {(booking.status !== 'cancelled' && booking.status !== 'completed') && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
