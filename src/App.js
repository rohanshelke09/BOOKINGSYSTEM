import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import Login from './Components/Auth/Login';
import UserRegistration from './Components/UserRegistration';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import styled from 'styled-components';
import GuestDashboard from './Components/Dashboard/GuestDashboard';
import Home from './Components/Home';
import GetUserBookings from './Components/GetUserBookings';
import BookRoom from './Components/BookRoom';
import GetHotelsById from './Components/GetHotelById';
import GetHotelReviews from './Components/GetHotelReviews';
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
          
          {/* Admin Routes */}
          {/* <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-hotels" element={<ManageHotels />} />
          </Route> */}

          {/* Manager Routes */}
          {/* <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/bookings" element={<ManageBookings />} />
          </Route> */}

          {/* Guest Routes */}
          <Route element={<ProtectedRoute allowedRoles={['guest']} />}>
            <Route path="/guest-dashboard" element={<GuestDashboard />} />
            <Route path="/booking" element={<BookRoom />} />
            <Route path="/my-bookings" element={<GetUserBookings />} />
            <Route path="/hotel-details/:hotelID" element={<GetHotelsById />} />
            <Route path="/hotel-reviews/:hotelID" element={<GetHotelReviews />} />
          </Route>

          <Route path="/" element={<Home />} />
        </Routes>
      </MainContent>
      <Footer />
    </div>
    </BrowserRouter>
  );
}
export default App;