import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

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
const BookingCard = styled.div`
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f8f9fa;
`;

const GuestDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulated API call to fetch guest's bookings
    const fetchBookings = async () => {
      try {

        const token = localStorage.getItem('token');
        const tokenObj = token ? JSON.parse(token) : null;
        const decodedToken = jwtDecode(tokenObj.token);
        const userID = decodedToken.nameid?.[0];

      if (!userID) {
        throw new Error('User ID not found in token');
      }
            const response = await axios.get(`https://localhost:7125/api/Bookings/User/${userID}`, {
                headers: {
                    Authorization: `Bearer ${tokenObj?.token}`,
                    'Content-Type': 'application/json'
                }
            });
  
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);
  const handleNewBooking = () => {
    navigate('/available-hotels');
  };
  return (
    <DashboardContainer>
      <WelcomeSection>
        <h1>Welcome to Your Dashboard</h1>
        <p>Manage your bookings and explore our hotel services</p>
      </WelcomeSection>

      <CardGrid>
        <Card>
          <h3>Current Bookings</h3>
          <ActionButton onClick={handleNewBooking}>
            Make New Booking
          </ActionButton>
          {loading ? (
            <p>Loading bookings...</p>
          ) : bookings.length > 0 ? (
            bookings.map(booking => (
              <BookingCard key={booking.bookingID}>
                <p>Room: {booking.roomNumber}</p>
                <p>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
                <p>Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                <p>Status: {booking.status}</p>
              </BookingCard>
            ))
          ) : (
            <p>No current bookings</p>
          )}
          
        </Card>
        <Card>


        </Card>

      </CardGrid>
    </DashboardContainer>
  );
};

export default GuestDashboard;