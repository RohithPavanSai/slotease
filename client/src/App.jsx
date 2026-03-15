import React from "react";
import Navbar from "./components/Navbar";
import Menu from "./components/Menu";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import BookSlot from "./pages/BookSlot";
import MyBookings from "./pages/MyBookings";
import Salons from "./pages/Salons";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignUpPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CustomerLayout from "./pages/Customer/CustomerLayout";
import HomePage from "./pages/Customer/HomePage";
import SalonListing from "./pages/Customer/SalonListing";
import SalonDetails from "./pages/Customer/SalonDetails";
import StaffPage from "./pages/Customer/StaffPage";
import SalonLayout from "./pages/Salons/SalonLayout";
import SalonDashboard from "./pages/Salons/SalonDashboard";
import ManageServices from "./pages/Salons/SalonServices";
import MainDashboardPage from "./pages/MainDashboardPage";
import SalonStaffPage from "./pages/Salons/SalonStaffPage.jsx";
import HairstyleTryOn from "./pages/HairstyleTryOn.jsx";
import HairstyleApp from "./pages/HairstyleApp.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import StylistLayout from "./pages/Stylists/StylistLayout.jsx";
import StylistDashboard from "./pages/Stylists/StylistDashboard.jsx";
import UpdateTimeslots from "./pages/Stylists/UpdateTimeslots.jsx";
import StylistSlotPage from "./pages/Customer/StylistSlotPage.jsx";

const App = () => {
  return (
    <div>
      {/* <Navbar/> */}
      <Menu />
      <Routes>
        <Route path="/" element={<MainDashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* General pages that don't need a specific User ID */}
        <Route path="/salons" element={<Salons />} />
        <Route path="/hairstyle" element={<HairstyleApp />} />

        {/* CUSTOMER ROUTES - All URLs start with /customer/:id/ */}
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

          {/* These were missing or misplaced */}
          <Route path="bookings" element={<MyBookings />} />
          <Route path="hairstyletryon" element={<HairstyleTryOn />} />
          <Route path="bookslot" element={<BookSlot />} />
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
      </Routes>
    </div>
  );
};

export default App;
