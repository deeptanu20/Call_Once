/* eslint-disable react/prop-types */
"use client";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ServiceProviderDashboard from "./pages/ServiceProviderDashboard";
import ServiceFormPage from "./pages/adminComponents/ServiceFormPage"; // Add this import
import ServiceList from "./pages/ServiceList";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import ServiceDetails from "./pages/ServiceDetails";
import BookingForm from "./components/BookingForm";
import BookingDetails from "./pages/BookingDetails";
import ServiceBookings from "./pages/ServiceBookings";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PaymentPage from "./pages/userComponents/PaymentPage";
import { Toaster } from "react-hot-toast";

// Custom Route component to handle role-based redirection
const RoleBasedRoute = ({ element, requiredRole, ...rest }) => {
  const { authData, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // Prevent redirect during loading state
  
    const redirectPath = authData
      ? authData.role === "admin"
        ? "/admin/dashboard"
        : authData.role === "service_provider"
        ? "/provider/dashboard"
        : "/user/dashboard"
      : "/login";
  
    // Perform the redirection
    if (window.location.pathname !== redirectPath) {
      window.location.href = redirectPath;
    }
  }, [authData, loading, requiredRole]);
  

  return authData && authData.role === requiredRole ? element : null;
};

const App = () => {
  const location = useLocation();

  // List of routes where the footer should not be displayed
  const hideFooterRoutes = ["/login", "/register"];

  return (
    <AuthProvider>
      <Navbar />
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/service/:serviceId" element={<ServiceDetails />} />
        <Route path="/booking-form" element={<BookingForm />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="/bookings/:serviceId" element={<ServiceBookings />} />
        <Route path="/payment" element={<PaymentPage/>}/>

        {/* Role-Based Private Routes */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/user/dashboard"
          element={
            <RoleBasedRoute element={<UserDashboard />} requiredRole="user" />
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <RoleBasedRoute element={<AdminDashboard />} requiredRole="admin" />
          }
        />
        <Route
          path="/provider/dashboard"
          element={
            <RoleBasedRoute
              element={<ServiceProviderDashboard />}
              requiredRole="service_provider"
            />
          }
        />
        
        {/* New Service Form Routes */}
        <Route
          path="/service-form"
          element={
            <RoleBasedRoute
              element={<ServiceFormPage />}
              requiredRole="service_provider"
            />
          }
        />
        <Route
          path="/service-form/:serviceId"
          element={
            <RoleBasedRoute
              element={<ServiceFormPage />}
              requiredRole="service_provider"
            />
          }
        />

        {/* Other public routes */}
        <Route path="/services" element={<ServiceList />} />
      </Routes>
      {/* Conditionally render Footer */}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </AuthProvider>
  );
};

export default App;