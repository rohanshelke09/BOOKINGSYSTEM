import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import Login from './Components/Auth/Login';
import UserRegistration from './Components/UserRegistration';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import styled from 'styled-components';
import GuestDashboard from './Components/Dashboard/GuestDashboard';
import AdminDashboard from './Components/Dashboard/AdminDashboard';
import Home from './Components/Home';
import BookRoom from './Components/BookRoom';
import ManageGuests from './Components/Auth/ManageGuests';
import ManageManagers from './Components/Auth/ManageManagers'; 
import ManageHotels from './Components/Auth/ManageHotels';
import ManageBookings from './Components/Auth/ManageBookings';
import ManageReviews from './Components/Auth/ManageReviews'; // Ensure this import is correct

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
            <Route path="/manage_guests" element={<ManageGuests />} />
            <Route path="/manage_managers" element={<ManageManagers />} /> {/* Add route for ManageManagers */}

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/manage_hotel" element={<ManageHotels />} />
              <Route path="/manage_booking" element={<ManageBookings />} />
              <Route path="/manage_reviews" element={<ManageReviews />} /> {/* Ensure this route is correct */}
            </Route>

            {/* Guest Routes */}
            <Route element={<ProtectedRoute allowedRoles={['guest']} />}>
              <Route path="/guest-dashboard" element={<GuestDashboard />} />
              <Route path="/booking" element={<BookRoom />} />
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