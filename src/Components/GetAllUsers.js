import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fff;
`;

const Title = styled.h2`
  text-align: center;
  color: #007bff;
  margin-bottom: 30px;
`;

const BookingCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const UserDetail = styled.div`
  margin-bottom: 10px;
  
  strong {
    color: #2c3e50;
    margin-right: 8px;
  }
`;

const Status = styled.span`
  color: ${props => props.status === 'Confirmed' ? '#28a745' : '#ffc107'};
  font-weight: 500;
`;

const ActionButton = styled.button`
  background-color: ${props => props.variant === 'cancel' ? '#dc3545' : '#007bff'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.variant === 'cancel' ? '#c82333' : '#0056b3'};
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #ccc;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  margin: 20px auto;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #dc3545;
  padding: 20px;
  background-color: #f8d7da;
  border-radius: 4px;
  margin-top: 20px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #6c757d;
`;

const GetAllUsers = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllUsers = async () => {
    try {
      const tokenObj = JSON.parse(localStorage.getItem("token"));
      if (!tokenObj?.token) {
        throw new Error('No authentication token found');
      }

      const decodedToken = jwtDecode(tokenObj.token);
      const userId = decodedToken.nameid?.[0];

      if (!userId) {
        throw new Error('User ID not found in token');
      }

      const response = await axios.get(`http://localhost:5217/api/Bookings/User`, {
        headers: {
          'Authorization': `Bearer ${tokenObj.token}`
        }
      });

      setBookings(response.data);
    } catch (error) {
      setError(error.message);
      if (error.message.includes('token')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, [navigate]);

  const handleCancelBooking = async (bookingId) => {
    try {
      const tokenObj = JSON.parse(localStorage.getItem("token"));
      await axios.put(`https://localhost:5217/api/Bookings/${bookingId}/cancel`, null, {
        headers: {
          'Authorization': `Bearer ${tokenObj.token}`
        }
      });
      fetchUserBookings(); // Refresh bookings after cancellation
    } catch (error) {
      setError("Failed to cancel booking: " + error.message);
    }
  };

  if (loading) return (
    <Container>
      <Title>My Bookings</Title>
      <LoadingSpinner />
    </Container>
  );

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      <Title>My Bookings</Title>
      
      {bookings.length === 0 ? (
        <EmptyMessage>No bookings found.</EmptyMessage>
      ) : (
        bookings.map((booking) => (
          <BookingCard key={booking.bookingID}>
            <BookingDetail>
              <strong>Booking ID:</strong> {booking.bookingID}
            </BookingDetail>
            <BookingDetail>
              <strong>Room ID:</strong> {booking.roomID}
            </BookingDetail>
            <BookingDetail>
              <strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}
            </BookingDetail>
            <BookingDetail>
              <strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}
            </BookingDetail>
            <BookingDetail>
              <strong>Status:</strong> <Status status={booking.status}>{booking.status}</Status>
            </BookingDetail>
            
            {booking.status === 'Confirmed' && (
              <ActionButton 
                variant="cancel"
                onClick={() => handleCancelBooking(booking.bookingID)}
              >
                Cancel Booking
              </ActionButton>
            )}
          </BookingCard>
        ))
      )}
    </Container>
  );
};

export default GetAllUsers;