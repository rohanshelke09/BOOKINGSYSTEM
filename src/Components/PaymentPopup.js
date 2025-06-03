import React, { useState } from 'react';
import styled from 'styled-components';


const PaymentPopup = ({ isOpen, onClose, bookingDetails, onPaymentComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <h1>"Booking Completed"</h1>
  );
};

export default PaymentPopup;