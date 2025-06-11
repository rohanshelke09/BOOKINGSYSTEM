import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import Login from "./Components/Auth/Login";
import UserRegistration from "./Components/UserRegistration";
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import styled from "styled-components";
import GuestDashboard from "./Components/Dashboard/GuestDashboard";
import ManagerDashboard from "./Components/Dashboard/ManagerDashboard";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";
import Home from "./Components/Home";
import GetUserBookings from "./Components/GetUserBookings";
import GetBookingByBookingId from "./Components/GetBookingByBookingId";
import AddRoom from "./Components/AddRoom";
import RoomManagement from "./Components/RoomManagement";
// import AvailableRooms from './Components/AvailableRooms';
import GetHotelsById from "./Components/GetHotelById";
import GetHotelReviews from "./Components/GetHotelReviews";
import GetAvailableHotels from "./Components/GetAvailableHotels";
import GetAvailableRooms from "./Components/GetAvailableRooms";
import GetRoomsByHotel from "./Components/GetRoomsByHotel";
import ManageHotels from "./Components/Auth/ManageHotels";
import ManageBookings from "./Components/Auth/ManageBookings";
import UpdateRoom from "./Components/UpdateRoom";

import ViewAllBookings from "./Components/ViewAllBookings";
import ManagerAvailableRooms from "./Components/ManagerAvailableRooms";
import ViewGuests from "./Components/ViewGuest";
import GetBookingByUser from "./Components/GetBookingbyUserId";
import GetBookingByRoom from "./Components/GetBookingbyRoomID";

import Payment from "./Components/Payment";
import PaymentSuccess from "./Components/PaymentSuccess";
import NotFound from "./Components/NotFound";

import ManageReviews from "./Components/Auth/ManageReviews"; // add manage reviews
import About from "./Components/About";
import Contact from "./Components/Contact";
import SpecialOffers from "./Components/SpecialOffers";
import ScrollToTop from "./Components/ScrollToTop";
import GetUsersAllBookings from "./Components/GetUsersAllBookings";
import ManageGuests from "./Components/Auth/ManageGuests";
import ManageManagers from "./Components/Auth/ManageManagers";

const MainContent = styled.main`
  min-height: calc(100vh - 160px);
  padding: 20px;
  margin-top: 80px; // Reduced from 120px for better initial view
  background-color: #f5f5f5;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    margin-top: 60px;
    padding: 15px;
  }
`;

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="App">
        <Header />
        <MainContent>
          <Routes>
            {/* Anyone show Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/" element={<Home />} />
            <Route path="/hotel-details/:hotelID" element={<GetHotelsById />} />
            <Route
              path="/available-rooms/:hotelID/:checkIn/:checkOut"
              element={<GetAvailableRooms />}
            />
            <Route
              path="/hotel-reviews/:hotelID"
              element={<GetHotelReviews />}
            />
            <Route path="/available-hotels" element={<GetAvailableHotels />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/offers" element={<SpecialOffers />} />
            <Route path="*" element={<NotFound />} />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/manage-guests" element={<ManageGuests />} />
              <Route path="manage-managers" element={<ManageManagers />} />
              <Route path="/manage-hotels" element={<ManageHotels />} />
              <Route path="/manage-bookings" element={<ManageBookings />} />
              <Route path="/manage-reviews" element={<ManageReviews />} />
            </Route>
            {/* Manager Routes */}
            <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
              <Route path="/manager-dashboard" element={<ManagerDashboard />} />
              <Route
                path="/hotel-rooms/:hotelID"
                element={<GetRoomsByHotel />}
              />
              <Route
                path="/bookings/:bookingId"
                element={<GetBookingByBookingId />}
              />
              <Route
                path="/hotel-rooms/:hotelID/manage"
                element={<RoomManagement />}
              />
              <Route path="/hotel-rooms/:hotelID/add" element={<AddRoom />} />
              <Route
                path="/hotel-rooms/:hotelID/update"
                element={<UpdateRoom />}
              />
              <Route
                path="/available-rooms/:hotelID/:checkIn/:checkOut"
                element={<GetAvailableRooms />}
              />

              <Route path="/manager-dashboard" element={<ManagerDashboard />} />
              <Route
                path="/hotel-rooms/:hotelID"
                element={<GetRoomsByHotel />}
              />
              <Route
                path="/bookings/:bookingId"
                element={<GetBookingByBookingId />}
              />
              <Route
                path="/hotel-rooms/:hotelID/manage"
                element={<RoomManagement />}
              />
              <Route path="/hotel-rooms/:hotelID/add" element={<AddRoom />} />
              <Route
                path="/hotel-rooms/:hotelID/update"
                element={<UpdateRoom />}
              />
              <Route
                path="/available-rooms/:hotelID/:checkIn/:checkOut"
                element={<GetAvailableRooms />}
              />

              <Route path="/bookings" element={<ViewAllBookings />} />
              <Route
                path="/available-rooms/:hotelID"
                element={<ManagerAvailableRooms />}
              />
              <Route path="/hotels/:hotelID/guests" element={<ViewGuests />} />
              <Route
                path="/bookings/user/:hotelID"
                element={<GetBookingByUser />}
              />
              <Route
                path="/bookings/room/:hotelID"
                element={<GetBookingByRoom />}
              />
            </Route>
            {/* Guest Routes */}
            <Route element={<ProtectedRoute allowedRoles={["guest"]} />}>
              <Route path="/guest-dashboard" element={<GuestDashboard />} />
              {/* <Route path="/booking" element={<Booking />} /> */}
              <Route path="/my-bookings" element={<GetUserBookings />} />
              <Route
                path="/usersallbookings"
                element={<GetUsersAllBookings />}
              />
              <Route
                path="/hotel-reviews/:hotelID"
                element={<GetHotelReviews />}
              />
              <Route
                path="/available-hotels"
                element={<GetAvailableHotels />}
              />
              <Route
                path="/available-rooms/:hotelID/:checkIn/:checkOut"
                element={<GetAvailableRooms />}
              />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
            </Route>
          </Routes>
        </MainContent>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
