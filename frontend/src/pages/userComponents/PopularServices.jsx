import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PopularServices = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const services = [
    {
      title: "Car repairing",
      description: "Professional car repair services",
      image: "/CarRepairing.png",
    },
    {
      title: "Plumber",
      description: "Expert plumbing solutions",
      image: "/Plumber.png",
    },
    {
      title: "Carpenter",
      description: "Quality carpentry work",
      image: "/Carpenter.png",
    },
    {
      title: "AC repairing",
      description: "Complete AC maintenance",
      image: "/ACrepair.png",
    },
  ];

  const scrollToIndex = (index) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const card = container.children[0];
      const cardWidth = card.offsetWidth;
      const gap = 32; // 8 * 4 (gap-8 in tailwind)
      container.scrollTo({
        left: index * (cardWidth + gap),
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    const newIndex = currentIndex + 1 >= services.length ? 0 : currentIndex + 1;
    scrollToIndex(newIndex);
  };

  const handlePrev = () => {
    const newIndex = currentIndex - 1 < 0 ? services.length - 1 : currentIndex - 1;
    scrollToIndex(newIndex);
  };

  return (
    <section className="py-5 relative">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8">Popular services</h2>
        
        {/* Navigation Buttons */}
        <div className="absolute bottom-1/4 left-4 transform -translate-y-1/2 z-10">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute bottom-1/4 right-4 transform -translate-y-1/2 z-10">
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Cards Container */}
        <div className="relative overflow-hidden">
          <div
            ref={containerRef}
            className="flex gap-8 sm:gap-4 overflow-x-hidden scroll-smooth snap-x snap-mandatory touch-pan-x h-full"
          >
            {services.map((service, index) => (
              <div
                key={index}
                className="flex-none w-[90%] sm:w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] lg:w-[calc(25%-2rem)] snap-start"
              >
                <div className="flex bg-gradient-to-r from-[#45389B] to-[#292259] text-white rounded-xl shadow-lg overflow-hidden h-full">
                  <div className="relative w-1/2 mt-1 h-full pt-5 flex-shrink-0">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="absolute inset-0 object-contain w-full h-full hover:scale-110 transition duration-300"
                    />
                  </div>
                  <div className="flex-1 p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-200 mb-4 text-sm md:text-base">{service.description}</p>
                    <Link to="/services">
                      <button className="bg-white text-black px-4 py-2 rounded-full shadow-md hover:bg-gray-200 transition duration-300 text-sm md:text-base">
                        Book now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="hidden justify-center mt-4 gap-2">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index ? "bg-[#45389B]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularServices;