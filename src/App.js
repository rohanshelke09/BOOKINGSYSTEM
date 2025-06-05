import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import Login from './Components/Auth/Login';
import UserRegistration from './Components/UserRegistration';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import styled from 'styled-components';
import GuestDashboard from './Components/Dashboard/GuestDashboard';
import ManagerDashboard from './Components/Dashboard/ManagerDashboard';
import Home from './Components/Home';
import GetUserBookings from './Components/GetUserBookings';
import GetBookingByBookingId from './Components/GetBookingByBookingId';

import GetHotelsById from './Components/GetHotelById';
import GetHotelReviews from './Components/GetHotelReviews';
import GetAvailableHotels from './Components/GetAvailableHotels';
import GetAvailableRooms from './Components/GetAvailableRooms';
import GetRoomsByHotel from './Components/GetRoomsByHotel';
const MainContent = styled.main`
  min-height: calc(100vh - 160px); // Adjust based on header/footer height
  padding: 20px;
  margin-top: 120px; // To account for fixed header
  background-color: #f5f5f5;
`;
function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Header />
      <MainContent>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<UserRegistration />} />
          <Route path="/" element={<Home />} />

          {/* Admin Routes */}
          {/* <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-hotels" element={<ManageHotels />} />
          </Route> */}

          {/* Manager Routes */}
          <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            <Route path="/hotel-rooms/:hotelID" element={<GetRoomsByHotel />} />
            <Route path="/bookings/:bookingId" element={<GetBookingByBookingId />} />
          </Route>

          {/* Guest Routes */}
          <Route element={<ProtectedRoute allowedRoles={['guest']} />}>
            <Route path="/guest-dashboard" element={<GuestDashboard />} />
            {/* <Route path="/booking" element={<Booking />} /> */}
            <Route path="/my-bookings" element={<GetUserBookings />} />
            <Route path="/hotel-details/:hotelID" element={<GetHotelsById />} />
            <Route path="/hotel-reviews/:hotelID" element={<GetHotelReviews />} />
            <Route path="/available-hotels" element={<GetAvailableHotels/>} />
            <Route path="/available-rooms/:hotelID/:checkIn/:checkOut" element={<GetAvailableRooms />} />
          </Route>

          
        </Routes>
      </MainContent>
      <Footer />
    </div>
    </BrowserRouter>
  );
}
export default App;