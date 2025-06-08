import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessContainer = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 40px 20px;
  text-align: center;
`;

const SuccessCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 40px;
`;

const SuccessIcon = styled(FaCheckCircle)`
  font-size: 64px;
  color: #28a745;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
`;

const Message = styled.p`
  color: #6c757d;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const DetailsList = styled.div`
  text-align: left;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;

  p {
    margin: 10px 0;
    color: #2c3e50;
  }
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #0056b3;
  }
`;

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentDetails, bookingID } = location.state || {};

  useEffect(() => {
    if (!paymentDetails || !bookingID) {
      navigate('/');
    }
  }, [paymentDetails, bookingID, navigate]);

  return (
    <SuccessContainer>
      <SuccessCard>
        <SuccessIcon />
        <Title>Payment Successful!</Title>
        <Message>
          Thank you for your booking. Your room has been successfully reserved.
        </Message>
        
        <DetailsList>
          <p><strong>Booking ID:</strong> {bookingID}</p>
          <p><strong>Amount Paid:</strong> ${paymentDetails?.amount}</p>
          <p><strong>Payment Method:</strong> {paymentDetails?.paymentMethod}</p>
          <p><strong>Status:</strong> Confirmed</p>
        </DetailsList>

        <Button onClick={() => navigate('/guest-dashboard')}>
          View My Bookings
        </Button>
      </SuccessCard>
    </SuccessContainer>
  );
};

export default PaymentSuccess;