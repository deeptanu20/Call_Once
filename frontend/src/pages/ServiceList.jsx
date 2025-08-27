import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../services/categoryService";
import { getServicesByCategory } from "../services/serviceService";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ServiceList = () => {
  const [servicesByCategory, setServicesByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [scrollStates, setScrollStates] = useState({});
  const scrollContainers = useRef({});

  useEffect(() => {
    const fetchServicesAndCategories = async () => {
      try {
        const categories = await getCategories();
        const servicesByCat = {};
        await Promise.all(
          categories.map(async (category) => {
            const data = await getServicesByCategory(category._id);
            servicesByCat[category.name] = data.services || [];
          })
        );
        setServicesByCategory(servicesByCat);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    };

    fetchServicesAndCategories();
  }, []);

  const checkScrollPosition = (category) => {
    const container = scrollContainers.current[category];
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setScrollStates(prev => ({
        ...prev,
        [category]: {
          canScrollLeft: scrollLeft > 0,
          canScrollRight: scrollLeft < scrollWidth - clientWidth - 1 // -1 for rounding errors
        }
      }));
    }
  };

  useEffect(() => {
    // Initialize scroll states for all categories
    Object.keys(servicesByCategory).forEach(category => {
      checkScrollPosition(category);
    });
  }, [servicesByCategory]);

  const scroll = (category, direction) => {
    const container = scrollContainers.current[category];
    if (container) {
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      
      // Update scroll state after animation
      setTimeout(() => checkScrollPosition(category), 400);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-base font-medium text-gray-500">
          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-slate-400 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading services...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {Object.entries(servicesByCategory).map(([category, services]) => (
          <div key={category} className="mb-8">
            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
                <p className="text-gray-600 text-sm mt-1">
                  lorem ipsum dolor odor
                </p>
              </div>
              
              <div className="relative">
                {/* Only show left arrow if we can scroll left */}
                {services.length > 0 && scrollStates[category]?.canScrollLeft && (
                  <button 
                    onClick={() => scroll(category, 'left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6 text-slate-800" />
                  </button>
                )}
                
                <div 
                  ref={el => scrollContainers.current[category] = el}
                  className="flex overflow-x-hidden gap-4 scroll-smooth pb-4"
                  onScroll={() => checkScrollPosition(category)}
                >
                  {services.map((service) => (
                    <Link
                      to={`/service/${service._id}`}
                      key={service._id}
                      className="flex-none w-38 sm:w-48 bg-gray-50 rounded-2xl py-4 px-7 sm:px-8 hover:bg-gray-100 transition-colors"
                    >
                      <div className="bg-white rounded-xl p-3 mb-2 w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center">
                        <img
                          src={service.icon || "/PlumberLogo.jpg"}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {service.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-green-100 w-fit px-2 py-0.5 rounded-full mb-1">
                        <span className="text-xs font-medium text-green-800">
                          {service.rating || "4.4"} ★
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        From ₹{service.price}
                      </p>
                    </Link>
                  ))}
                </div>

                {/* Only show right arrow if we can scroll right */}
                {services.length > 0 && scrollStates[category]?.canScrollRight && (
                  <button 
                    onClick={() => scroll(category, 'right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6 text-slate-800" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;