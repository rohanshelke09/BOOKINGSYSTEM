import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const CancelButton = styled.button`
  background-color: ${props => props.$isProcessing ? '#6c757d' : '#dc3545'};
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.$isProcessing ? 'not-allowed' : 'pointer'};
  transition: background-color 0.3s ease;
  font-size: 14px;

  &:hover {
    background-color: ${props => props.$isProcessing ? '#6c757d' : '#c82333'};
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 8px;
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  max-width: 400px;
  width: 90%;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: flex-end;
`;

const CancelBooking = ({ bookingId, onCancelSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCancel = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const tokenData = JSON.parse(localStorage.getItem('token'));
      if (!tokenData?.token) {
        throw new Error('Authentication required');
      }

      await axios.post(
        `https://localhost:7125/api/Bookings/cancel/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        }
      );

      onCancelSuccess();
      setShowConfirmation(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <CancelButton
        onClick={() => setShowConfirmation(true)}
        $isProcessing={isProcessing}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Cancel Booking'}
      </CancelButton>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {showConfirmation && (
        <>
          <Overlay onClick={() => !isProcessing && setShowConfirmation(false)} />
          <ConfirmationModal>
            <h3>Confirm Cancellation</h3>
            <p>Are you sure you want to cancel this booking?</p>
            <ButtonGroup>
              <CancelButton
                onClick={() => setShowConfirmation(false)}
                disabled={isProcessing}
              >
                No, Keep It
              </CancelButton>
              <CancelButton
                onClick={handleCancel}
                $isProcessing={isProcessing}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Yes, Cancel'}
              </CancelButton>
            </ButtonGroup>
          </ConfirmationModal>
        </>
      )}
    </>
  );
};

export default CancelBooking;