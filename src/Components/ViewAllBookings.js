import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaCalendarAlt, FaUser, FaBed, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const BookingsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
`;

const BookingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const BookingCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  border-left: 5px solid ${props => 
    props.status === 'Confirmed' ? '#2ecc71' : 
    props.status === 'Pending' ? '#f1c40f' : 
    props.status === 'Cancelled' ? '#e74c3c' : '#95a5a6'};

  &:hover {
    transform: translateY(-5px);
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${props => 
    props.status === 'Confirmed' ? '#d4edda' : 
    props.status === 'Pending' ? '#fff3cd' : 
    props.status === 'Cancelled' ? '#f8d7da' : '#e2e3e5'};
  color: ${props => 
    props.status === 'Confirmed' ? '#155724' : 
    props.status === 'Pending' ? '#856404' : 
    props.status === 'Cancelled' ? '#721c24' : '#383d41'};
`;

const BookingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;

  svg {
    color: #3498db;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #3498db;
`;

const ViewAllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const tokenObj = token ? JSON.parse(token) : null;

        if (!tokenObj?.token) {
          throw new Error('Authentication required');
        }

        const decodedToken = jwtDecode(tokenObj.token);
        const managerId = decodedToken.nameid?.[0];

        // First get the hotel ID
        const hotelResponse = await axios.get(
          `https://localhost:7125/api/Hotels/by-manager/${managerId}`,
          {
            headers: {
              Authorization: `Bearer ${tokenObj.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!hotelResponse.data?.hotelID) {
          throw new Error('No hotel ID found');
        }

        // Then get all bookings for this hotel
        const bookingsResponse = await axios.get(
          `https://localhost:7125/api/Bookings/Hotel/${hotelResponse.data.hotelID}`,
          {
            headers: {
              Authorization: `Bearer ${tokenObj.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>Loading bookings...</LoadingSpinner>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <BookingsContainer>
          <Title>Error: {error}</Title>
        </BookingsContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BookingsContainer>
        <Title>All Bookings</Title>
        <BookingGrid>
          {bookings.map(booking => (
            <BookingCard key={booking.bookingId} status={booking.status}>
              <BookingHeader>
                <h3>Booking {booking.bookingID}</h3>
                <StatusBadge status={booking.status}>
                  {booking.status === 'Confirmed' && <FaCheckCircle />}
                  {booking.status === 'Cancelled' && <FaTimesCircle />}
                  {booking.status}
                </StatusBadge>
              </BookingHeader>
              <BookingInfo>
                <FaUser /> Guest: {booking.user.name}
              </BookingInfo>
              <BookingInfo>
                <FaBed /> Room: {booking.roomID}
              </BookingInfo>
              <BookingInfo>
                <FaCalendarAlt /> Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
              </BookingInfo>
              <BookingInfo>
                <FaCalendarAlt /> Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
              </BookingInfo>
            </BookingCard>
          ))}
        </BookingGrid>
      </BookingsContainer>
    </PageContainer>
  );
};

export default ViewAllBookings;