import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin: 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #6c757d;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

const BookingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const BookingCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: ${props => {
    switch (props.$status?.toLowerCase()) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }};
  color: white;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #007bff;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #dc3545;
  background: #f8d7da;
  border-radius: 8px;
  margin: 20px 0;
`;

const GetUsersAllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const tokenObj = token ? JSON.parse(token) : null;

        if (!tokenObj?.token) {
          throw new Error('Authentication required');
        }

        const decodedToken = jwtDecode(tokenObj.token);
        const userID = decodedToken.nameid?.[0];

        if (!userID) {
          throw new Error('User ID not found');
        }

        const response = await axios.get(
          `https://localhost:7125/api/Bookings/User/${userID}`,
          {
            headers: {
              Authorization: `Bearer ${tokenObj.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        setBookings(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <LoadingSpinner>Loading your bookings...</LoadingSpinner>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <PageContainer>
      <Header>
        <Title>All Your Bookings</Title>
        <BackButton onClick={() => navigate('/guest-dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </BackButton>
      </Header>

      <BookingsGrid>
        {bookings.length > 0 ? (
          bookings
            .sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate))
            .map(booking => (
              <BookingCard key={booking.bookingID}>
                <h3>Booking #{booking.bookingID}</h3>
                <p><strong>Room:</strong> {booking.roomID || 'Not assigned'}</p>
                <p><strong>Check-in:</strong> {formatDate(booking.checkInDate)}</p>
                <p><strong>Check-out:</strong> {formatDate(booking.checkOutDate)}</p>
                <p>
                  <strong>Status: </strong>
                  <StatusBadge $status={booking.status}>
                    {booking.status}
                  </StatusBadge>
                </p>
              </BookingCard>
            ))
        ) : (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#6c757d' }}>
            No bookings found
          </p>
        )}
      </BookingsGrid>
    </PageContainer>
  );
};

export default GetUsersAllBookings;