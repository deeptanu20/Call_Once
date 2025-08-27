/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react';

const ImageGallery = ({ images }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      if (scrollRef.current) {
        e.preventDefault();
        scrollRef.current.scrollLeft += e.deltaY;
      }
    };

    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <div 
      ref={scrollRef}
      className="w-full bg-gray-100 p-4 mb-6 overflow-x-scroll scrollbar-hide"
    >
      <div className="flex space-x-4">
        {images && images.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-64 h-96 bg-gray-800 rounded-lg overflow-hidden"
          >
            <img
              src={image}
              alt={`Gallery item ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;

