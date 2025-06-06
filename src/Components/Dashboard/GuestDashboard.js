import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #007bff, #0056b3);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 30px;
  color: white;
  text-align: center;

  h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 600;
  }

  p {
    margin-top: 10px;
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 1.5rem;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
  }
`;

const ActionButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  width: 100%;
  margin-bottom: 15px;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

const BookingCard = styled.div`
  padding: 20px;
  margin: 15px 0;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  background-color: #f8f9fa;
  transition: all 0.2s ease;

  &:hover {
    border-color: #007bff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  p {
    margin: 8px 0;
    color: #495057;
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

const ServiceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;

  li {
    padding: 12px 0;
    border-bottom: 1px solid #e9ecef;
    color: #495057;
    display: flex;
    align-items: center;

    &:last-child {
      border-bottom: none;
    }

    &:before {
      content: "→";
      margin-right: 10px;
      color: #007bff;
    }
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #007bff;
  font-weight: 500;
`;
const ViewAllButton = styled(ActionButton)`
  background-color: transparent;
  border: 2px solid #007bff;
  color: #007bff;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;
const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    margin: 0;
    border: none;
    padding: 0;
  }
`;

const GuestDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const RECENT_BOOKINGS_COUNT = 1;
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

  return (
    <DashboardContainer>
      <WelcomeSection>
        <h1>Welcome to Your Dashboard</h1>
        <p>Manage your bookings and explore our premium hotel services</p>
      </WelcomeSection>

      <CardGrid>
        <Card>
        <BookingHeader>
            <h3>Recent Bookings</h3>
            <ViewAllButton 
              onClick={() => navigate('/usersallbookings')}
              style={{ margin: 0, width: 'auto' }}
            >
              View All Bookings
            </ViewAllButton>
          </BookingHeader>
          
          {loading ? (
            <LoadingSpinner>Loading your bookings...</LoadingSpinner>
          ) : error ? (
            <div style={{ color: '#dc3545', padding: '10px' }}>{error}</div>
          ) : bookings.length > 0 ? (
            <>
              {bookings
                .sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate))
                .slice(0, RECENT_BOOKINGS_COUNT)
                .map(booking => (
                  <BookingCard key={booking.bookingID}>
                    <h4>Booking #{booking.bookingID}</h4>
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
                ))}
              {bookings.length > RECENT_BOOKINGS_COUNT && (
                <p style={{ textAlign: 'center', color: '#6c757d', marginTop: '15px' }}>
                  + {bookings.length - RECENT_BOOKINGS_COUNT} more bookings
                </p>
              )}
            </>
          ) : (
            <p style={{ textAlign: 'center', color: '#6c757d' }}>
              No current bookings
            </p>
          )}
          <ActionButton onClick={() => navigate('/available-hotels')}>
            Make New Booking
          </ActionButton>
        </Card>

        

        <Card>
          <h3>Special Offers</h3>
          <p style={{ marginBottom: '20px', color: '#495057' }}>
            Discover exclusive deals and luxury packages tailored for our valued guests.
          </p>
          <ActionButton onClick={() => navigate('/offers')}>
            View Special Offers
          </ActionButton>
        </Card>
      </CardGrid>
    </DashboardContainer>
  );
};

export default GuestDashboard;