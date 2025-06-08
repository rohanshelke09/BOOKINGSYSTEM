import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { 
  FaSearch, 
  FaCalendar, 
  FaBed, 
  FaUser, 
  FaIdCard, 
  FaCheckCircle,
  FaEnvelope, 
  FaPhone 
} from 'react-icons/fa';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Title = styled.h2`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const SearchSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  width: 200px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const BookingCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  svg {
    color: #3498db;
  }
`;

const Status = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${props => props.$confirmed ? '#e8f5e9' : '#fff3e0'};
  color: ${props => props.$confirmed ? '#2e7d32' : '#f57c00'};
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 1rem;
  background: #ffebee;
  border-radius: 8px;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #3498db;
`;

const GetBookingByUser = () => {
  const [userId, setUserId] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSearch = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    setUserData(null);
    setBooking(null);
    
    try {
      const token = localStorage.getItem('token');
      const tokenObj = token ? JSON.parse(token) : null;

      if (!tokenObj?.token) {
        throw new Error('Authentication required');
      }

      // Get booking details
      const bookingResponse = await axios.get(
        `https://localhost:7125/api/Bookings/User/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${tokenObj.token}`
          }
        }
      );

      if (!bookingResponse.data || !Array.isArray(bookingResponse.data) || bookingResponse.data.length === 0) {
        throw new Error('No booking found for this user');
      }

      const bookingData = bookingResponse.data[0];
      setBooking(bookingData);

      // Get user details
      const userResponse = await axios.get(
        `https://localhost:7125/api/User/${bookingData.userID}`,
        {
          headers: {
            Authorization: `Bearer ${tokenObj.token}`
          }
        }
      );
      setUserData(userResponse.data);

    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Failed to fetch information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Title>Search Booking by User ID</Title>

        <SearchSection>
          <SearchInput
            type="number"
            placeholder="Enter User ID..."
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <SearchButton 
            onClick={handleSearch}
            disabled={!userId || loading}
          >
            <FaSearch />
            {loading ? 'Searching...' : 'Search'}
          </SearchButton>
        </SearchSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {loading && (
          <LoadingSpinner>
            <div>Searching for booking details...</div>
          </LoadingSpinner>
        )}

        {booking && !loading && (
          <BookingCard>
            <InfoRow>
              <FaIdCard />
              <span>Booking ID: {booking.bookingID}</span>
            </InfoRow>
            <InfoRow>
              <FaUser />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span>User ID: {booking.userID}</span>
                {userData && (
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    Name: {userData.name || 'N/A'}
                  </span>
                )}
              </div>
            </InfoRow>
            {userData && (
              <>
                <InfoRow>
                  <FaEnvelope />
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    Email: {userData.email || 'N/A'}
                  </span>
                </InfoRow>
                <InfoRow>
                  <FaPhone />
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    Contact: {userData.contactNumber || 'N/A'}
                  </span>
                </InfoRow>
              </>
            )}
            <InfoRow>
              <FaBed />
              <span>Room ID: {booking.roomID}</span>
            </InfoRow>
            <InfoRow>
              <FaCalendar />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span>Check-in: {formatDate(booking.checkInDate)}</span>
                <span>Check-out: {formatDate(booking.checkOutDate)}</span>
              </div>
            </InfoRow>
            <InfoRow>
              <FaCheckCircle />
              <Status $confirmed={booking.status === 'confirmed'}>
                {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'N/A'}
              </Status>
            </InfoRow>
          </BookingCard>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default GetBookingByUser;