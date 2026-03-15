import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Menu from "./components/Menu";

// Common Pages
import MainDashboardPage from "./pages/MainDashboardPage";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignUpPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Salons from "./pages/Salons";
import HairstyleApp from "./pages/HairstyleApp.jsx";
import MyProfile from "./pages/MyProfile.jsx";

// Customer Pages
import CustomerLayout from "./pages/Customer/CustomerLayout";
import HomePage from "./pages/Customer/HomePage";
import SalonListing from "./pages/Customer/SalonListing";
import SalonDetails from "./pages/Customer/SalonDetails";
import StaffPage from "./pages/Customer/StaffPage";
import StylistSlotPage from "./pages/Customer/StylistSlotPage.jsx";
import MyBookings from "./pages/MyBookings";
import BookSlot from "./pages/BookSlot";
import HairstyleTryOn from "./pages/HairstyleTryOn.jsx";
// Un-commented the Reviews import! Make sure this path matches your actual file.
import ReviewsPage from "./pages/Customer/ReviewsPage";

// Salon Pages
import SalonLayout from "./pages/Salons/SalonLayout";
import SalonDashboard from "./pages/Salons/SalonDashboard";
import ManageServices from "./pages/Salons/SalonServices";
import SalonStaffPage from "./pages/Salons/SalonStaffPage.jsx";

// Stylist Pages
import StylistLayout from "./pages/Stylists/StylistLayout.jsx";
import StylistDashboard from "./pages/Stylists/StylistDashboard.jsx";
import UpdateTimeslots from "./pages/Stylists/UpdateTimeslots.jsx";

const App = () => {
  return (
    <div>
      <Menu />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainDashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/salons" element={<Salons />} />
        <Route path="/hairstyle" element={<HairstyleApp />} />

        {/* CUSTOMER ROUTES */}
        <Route path="/customer/:id" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="salons" element={<SalonListing />} />
          <Route path="salon-details/:salonId" element={<SalonDetails />} />
          <Route path="staff/:salonId/:serviceName" element={<StaffPage />} />
          <Route path="myprofile" element={<MyProfile />} />
          <Route
            path="staff/:salonId/:serviceName/:stylistId/slots"
            element={<StylistSlotPage />}
          />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="bookslot" element={<BookSlot />} />
          <Route path="hairstyletryon" element={<HairstyleTryOn />} />
          {/* Un-commented the Reviews route! */}
          <Route path="reviews" element={<ReviewsPage />} />
        </Route>

        {/* SALON OWNER ROUTES */}
        <Route path="/salon/:id" element={<SalonLayout />}>
          <Route index element={<SalonDashboard />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="staff" element={<SalonStaffPage />} />
          <Route path="profile" element={<MyProfile />} />
        </Route>

        {/* STYLIST ROUTES */}
        <Route path="stylist/:id" element={<StylistLayout />}>
          <Route index element={<StylistDashboard />} />
          <Route path="schedule" element={<UpdateTimeslots />} />
          <Route path="myprofile" element={<MyProfile />} />
        </Route>

        {/* CATCH-ALL ROUTE: Redirects any unknown URL back to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
