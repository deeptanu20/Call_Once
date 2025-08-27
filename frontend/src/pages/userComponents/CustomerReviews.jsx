import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-6 h-6 ${index < rating ? 'text-white' : 'text-white/40'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const reviews = [
    {
      review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      name: 'Ramila Kaur',
      title: 'Customer',
      rating: 5,
      image: '/Customer1.jpg',
      bgColor: 'bg-[#619BF0]'
    },
    {
      review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      name: 'Alia Bhattacharjee',
      title: 'Customer',
      rating: 4,
      image: '/Customer2.jpg',
      bgColor: 'bg-[#5B8EDE]'
    },
    {
      review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      name: 'Shibu Shah',
      title: 'Customer',
      rating: 5,
      image: '/Customer3.jpg',
      bgColor: 'bg-[#7B6CF6]'
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  }, [reviews.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      const timer = setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds on mobile

      return () => clearInterval(timer);
    }
  }, [isMobile, nextSlide]);

  const renderReviewCard = (review, index) => (
    <div key={index} className={`${isMobile ? 'w-full flex-shrink-0' : ''} px-4 mb-8 md:mb-0`}>
      <div className={`${review.bgColor} p-8 rounded-[32px] text-white relative h-full`}>
        <StarRating rating={review.rating} />
        <p className="mb-8 text-white/90 leading-relaxed">{review.review}</p>
        <div className="absolute right-20 bottom-6">
          <p className="font-semibold">{review.name}</p>
          <p className="text-white/80">{review.title}</p>
        </div>
        <div className="absolute -right-2 -bottom-3">
          <img
            src={review.image}
            alt={review.name}
            className="w-20 h-20 rounded-full border-4 border-white"
          />
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-1">Customer reviews</h2>
          <p className="text-lg sm:text-xl text-gray-600">What customers tell about us.</p>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          {isMobile ? (
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review, index) => renderReviewCard(review, index))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review, index) => renderReviewCard(review, index))}
            </div>
          )}

          {isMobile && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors duration-200"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors duration-200"
                aria-label="Next review"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {isMobile && (
          <div className="flex justify-center mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 mx-1 rounded-full transition-colors duration-200 ${
                  currentIndex === index ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerReviews;

