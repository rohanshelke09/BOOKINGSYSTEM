import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PaymentPopup from './PaymentPopup';

const Booking = ({ roomID, price, checkIn, checkOut, onBookingComplete }) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('pending');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        setBookingStatus('booked');
        setIsPaymentOpen(true);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Booking failed');
    }
  };

  const handlePaymentComplete = () => {
    setIsPaymentOpen(false);
    onBookingComplete();
    navigate('/mybookings');
  };

  return (
    <>
      <button 
        onClick={handleBooking}
        disabled={bookingStatus === 'booked'}
      >
        {bookingStatus === 'booked' ? 'Booked' : 'Book Now'}
      </button>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <PaymentPopup
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        bookingDetails={{ roomID, price, checkIn, checkOut }}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
};

export default Booking;