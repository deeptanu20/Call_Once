import { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { getServices} from "../services/serviceService";
import Hero from './userComponents/Hero';
import PopularServices from './userComponents/PopularServices';
import WhyCallOnce from './userComponents/WhyCallOnce';
import CustomerReviews from './userComponents/CustomerReviews';

const UserDashboard = () => {
  const { authData, logout } = useAuth();
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (authData) {
      getServices()
        .then((data) => setServices(data))
        .catch((error) => console.log("Error fetching services:", error));
    }
  }, [authData]);

  return (
    <div className="font-sans">
      <Hero />
      <PopularServices />
      <WhyCallOnce />
      <CustomerReviews />
    </div>
  );
};

export default UserDashboard;