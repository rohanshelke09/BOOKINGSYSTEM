import React, { useState, useEffect ,useCallback} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import styled from 'styled-components';
import { FaCreditCard, FaMoneyBillWave, FaMobile, FaLock,FaArrowLeft } from 'react-icons/fa';

const PaymentContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
`;

const PaymentCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

const PaymentHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;

  h2 {
    color: #2c3e50;
    margin-bottom: 10px;
  }

  p {
    color: #6c757d;
  }
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
`;

const MethodButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border: 2px solid ${props => props.$selected ? '#007bff' : '#dee2e6'};
  border-radius: 10px;
  background: ${props => props.$selected ? '#f8f9fa' : 'white'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #007bff;
  }

  svg {
    font-size: 24px;
    color: #007bff;
  }
`;

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    color: #2c3e50;
    font-weight: 500;
  }

  input, select {
    padding: 12px;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    font-size: 16px;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
  }
`;

const PaymentSummary = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;

  h3 {
    color: #2c3e50;
    margin-bottom: 15px;
  }

  .amount {
    font-size: 24px;
    color: #007bff;
    font-weight: bold;
  }
`;

const PayButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 14px;
`;
const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: #6c757d;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover {
    background-color: #5a6268;
  }

  svg {
    font-size: 16px;
  }
`;

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  // Get booking details from location state
  const { price ,bookingID,checkIn,checkOut} = location.state || {};

  const calculateTotalDays = (checkIn, checkOut) => {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const totalDays = calculateTotalDays(checkIn, checkOut);
  const totalAmount = price * totalDays;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const tokenObj = token ? JSON.parse(token) : null;

      if (!tokenObj?.token) {
        throw new Error('Authentication required');
      }

      const decodedToken = jwtDecode(tokenObj.token);
      const userID = decodedToken.nameid?.[0];

      const paymentData = {
        userID: parseInt(userID),
        bookingID: bookingID,
        amount: totalAmount,
        status: true,
        paymentMethod: paymentMethod
      };

      const response = await axios.post(
        'https://localhost:7125/api/Payments',
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${tokenObj.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        // Payment successful
        navigate('/payment-success', { 
            state: { 
                paymentDetails: {
                  ...response.data,
                  amount: totalAmount,
                  paymentMethod
                },
                bookingID
              }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };
  const cancelBooking = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const tokenObj = token ? JSON.parse(token) : null;

      if (!tokenObj?.token) {
        throw new Error('Authentication required');
      }

      await axios.delete(
        `https://localhost:7125/api/Bookings/${bookingID}/`,

        {
          headers: {
            'Authorization': `Bearer ${tokenObj.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (err) {
      console.error('Error :', err);
    }
  }, [bookingID]);
 // Add useEffect for handling page unload
 useEffect(() => {
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    cancelBooking();
    return (event.returnValue = '');
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [cancelBooking]);

// Add back button handler
const handleBack = async () => {
  await cancelBooking();
  navigate(-1);
};
  return (
    <PaymentContainer>
      <PaymentCard>
        <PaymentHeader>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <BackButton onClick={handleBack}>
              <FaArrowLeft /> Back
            </BackButton>
            <h2>Complete Your Payment</h2>
            <div style={{ width: '80px' }}></div> {/* Spacer for alignment */}
          </div>
          <p>Choose your preferred payment method</p>
        </PaymentHeader>

        <PaymentSummary>
          <h3>Payment Summary</h3>
          <p>Booking ID: {bookingID}</p>
          <p>Number of nights: {totalDays}</p>
          <p>Price per night: ${price}</p>
          <p className="amount">Total Amount: ${totalAmount}</p>
        </PaymentSummary>

        <PaymentMethods>
          <MethodButton
            type="button"
            $selected={paymentMethod === 'Credit Card'}
            onClick={() => setPaymentMethod('Credit Card')}
          >
            <FaCreditCard />
            Credit Card
          </MethodButton>
          <MethodButton
            type="button"
            $selected={paymentMethod === 'Debit Card'}
            onClick={() => setPaymentMethod('Debit Card')}
          >
            <FaMoneyBillWave />
            Debit Card
          </MethodButton>
          <MethodButton
            type="button"
            $selected={paymentMethod === 'UPI'}
            onClick={() => setPaymentMethod('UPI')}
          >
            <FaMobile />
            UPI
          </MethodButton>
        </PaymentMethods>

        {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
          <PaymentForm onSubmit={handleSubmit}>
            <FormGroup>
              <label>Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength="16"
                required
                value={formData.cardNumber}
                onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
              />
            </FormGroup>

            <FormGroup>
              <label>Card Holder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                required
                value={formData.cardHolder}
                onChange={(e) => setFormData({...formData, cardHolder: e.target.value})}
              />
            </FormGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FormGroup>
                <label>Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                />
              </FormGroup>

              <FormGroup>
                <label>CVV</label>
                <input
                  type="password"
                  placeholder="123"
                  maxLength="3"
                  required
                  value={formData.cvv}
                  onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                />
              </FormGroup>
            </div>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <PayButton type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Pay Now'}
            </PayButton>
          </PaymentForm>
        )}

        {paymentMethod === 'UPI' && (
          <PaymentForm onSubmit={handleSubmit}>
            <FormGroup>
              <label>UPI ID</label>
              <input
                type="text"
                placeholder="username@upi"
                required
              />
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <PayButton type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Pay Now'}
            </PayButton>
          </PaymentForm>
        )}
      </PaymentCard>
    </PaymentContainer>
  );
};

export default Payment;