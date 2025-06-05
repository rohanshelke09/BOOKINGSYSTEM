import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    color: #2c3e50;
    margin-bottom: 15px;
  }
`;

const ActionButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [guests, setGuests] = useState([]);
  const [managers, setManagers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showUserOptions, setShowUserOptions] = useState(false); // Added state for user options

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const tokenObj = token ? JSON.parse(token) : null;

        // Fetch users
        const usersResponse = await axios.get('http://localhost:5217/api/User', {
          headers: { Authorization: `Bearer ${tokenObj?.token}` },
        });
        setUsers(usersResponse.data);

        // Fetch guests
        const guestsResponse = await axios.get('http://localhost:5217/api/User/by-role/guest', {
          headers: { Authorization: `Bearer ${tokenObj?.token}` },
        });
        setGuests(guestsResponse.data);

        // Fetch managers
        const managersResponse = await axios.get('http://localhost:5217/api/User/by-role/manager', {
          headers: { Authorization: `Bearer ${tokenObj?.token}` },
        });
        setManagers(managersResponse.data);

        // Fetch hotels
        const hotelsResponse = await axios.get('http://localhost:5217/api/Hotels', {
          headers: { Authorization: `Bearer ${tokenObj?.token}` },
        });
        setHotels(hotelsResponse.data);

        // Fetch bookings
        const bookingsResponse = await axios.get('http://localhost:5217/api/Bookings', {
          headers: { Authorization: `Bearer ${tokenObj?.token}` },
        });
        setBookings(bookingsResponse.data);

        // Fetch reviews
        const reviewsResponse = await axios.get('http://localhost:5217/api/Reviews', {
          headers: { Authorization: `Bearer ${tokenObj?.token}` },
        });
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardContainer>
      <WelcomeSection>
        <h1>Welcome to Your Dashboard</h1>
        <p>Manage the Users, Hotel Bookings, and Hotel Reviews</p>
      </WelcomeSection>

      <CardGrid>
        <Card className="bg-blue-50">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{users.length}</div>
            <div className="text-sm font-medium text-blue-500">Total Users</div>
          </div>
          <ActionButton onClick={() => setShowUserOptions(!showUserOptions)}>
            Manage Users
          </ActionButton>
          {showUserOptions && (
            <div className="mt-4 text-center">
              <ActionButton onClick={() => window.location.href = '/manage_guests'}>
                Manage Guests
              </ActionButton>
              <ActionButton onClick={() => window.location.href = '/manage_managers'} className="ml-4">
                Manage Managers
              </ActionButton>
            </div>
          )}
        </Card>
        <Card className="bg-green-50">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{hotels.length}</div>
            <div className="text-sm font-medium text-green-500">Total Hotels</div>
          </div>
          <ActionButton onClick={() => window.location.href = '/manage_hotel'}>
            Manage Hotels
          </ActionButton>
        </Card>
        <Card className="bg-yellow-50">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{bookings.length}</div>
            <div className="text-sm font-medium text-yellow-500">Total Bookings</div>
          </div>
          <ActionButton onClick={() => window.location.href = '/manage_booking'}>
            Manage Booking
          </ActionButton>
        </Card>
        <Card className="bg-purple-50">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{reviews.length}</div>
            <div className="text-sm font-medium text-purple-500">Total Reviews</div>
          </div>
          <ActionButton onClick={() => window.location.href = '/manage_reviews'}>
            Manage Reviews
          </ActionButton>
        </Card>
      </CardGrid>
    </DashboardContainer>
  );
};

export default AdminDashboard;