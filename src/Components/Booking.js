import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const BookingButton = styled.button`
  width: 100%;
  padding: 9px;
  background-color: ${props => props.$isBooked ? '#6c757d' : '#28a745'};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: ${props => props.$isBooked ? 'default' : 'pointer'};
  transition: background-color 0.3s ease;
  margin-top: auto;

  &:hover {
    background-color: ${props => props.$isBooked ? '#6c757d' : 'rgb(1, 71, 16)'};
  }
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 9px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

const Booking = ({ roomID, price, checkIn, checkOut, onBookingComplete }) => {
    const [id, setBookingID] = useState(null);
    const [bookingStatus, setBookingStatus] = useState('pending');
    const [error, setError] = useState(null);

  const handleBooking = async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('token'));
      
      const response = await axios.post(
        `https://localhost:7125/api/Bookings/${roomID}`,
        {
          checkInDate: checkIn,
          checkOutDate: checkOut,
          price: price
        },
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        }
      );
       
      if (response.data) {
        setBookingID(response.data.bookingID);
        setBookingStatus('booked');

      }
    } catch (error) {
      setError(error.response?.data?.message || 'Booking failed');
    }
  };
  const handleCancelBooking = async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem('token'));
      
      await axios.post(
        `https://localhost:7125/api/Bookings/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        }
      );

      setBookingStatus('pending');
      setBookingID(null);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Cancellation failed');
    }
  };

  return (
    <>
    <ButtonContainer>
      <BookingButton
        onClick={handleBooking}
        disabled={bookingStatus === 'booked'}
        $isBooked={bookingStatus === 'booked'}
      >
        {bookingStatus === 'booked' ? 'Booked' : 'Book Now'}
      </BookingButton>
      {bookingStatus === 'booked' && (
          <CancelButton onClick={handleCancelBooking}>
            Cancel Booking
          </CancelButton>
        )}
      </ButtonContainer>
      {error && <div style={{ color: 'red' }}>{error}</div>}

    </>
  );
};

export default Booking;