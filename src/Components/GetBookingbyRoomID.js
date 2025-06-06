import React, { useState } from 'react';
import axios from 'axios';
import styled ,{keyframes}from 'styled-components';
import { 
  FaSearch, 
  FaCalendar, 
  FaBed, 
  FaUser, 
  FaIdCard, 
  FaCheckCircle,
  FaEnvelope, 
  FaPhone,
  FaHotel,
  FaDoorOpen
} from 'react-icons/fa';

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 2rem;
`;
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ContentWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  color: #1e3c72;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 1rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(to right, #1e3c72, #2a5298);
    border-radius: 2px;
  }
`;

const SearchSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 1rem 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1.1rem;
  width: 250px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #1e3c72;
    box-shadow: 0 0 0 4px rgba(30, 60, 114, 0.1);
  }
`;

const SearchButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(to right, #1e3c72, #2a5298);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(30, 60, 114, 0.4);
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const BookingCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(30, 60, 114, 0.1);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;
  border-bottom: 1px solid rgba(30, 60, 114, 0.1);
  transition: all 0.3s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(30, 60, 114, 0.05);
    border-radius: 12px;
  }

  svg {
    color: #1e3c72;
    font-size: 1.3rem;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #2c3e50;
  min-width: 120px;
`;

const InfoValue = styled.span`
  color: #34495e;
`;

const Status = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  background: ${props => props.$confirmed ? '#e8f5e9' : '#fff3e0'};
  color: ${props => props.$confirmed ? '#2e7d32' : '#f57c00'};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 1.2rem;
  background: #fff5f5;
  border-radius: 12px;
  margin: 1rem 0;
  border: 1px solid #fed7d7;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #1e3c72;
`;

const GetBookingByRoom = () => {
    const [roomId, setRoomId] = useState('');
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
      if (!roomId) return;
      
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
  
        // Get all bookings
        const bookingsResponse = await axios.get(
          'https://localhost:7125/api/Bookings',
          {
            headers: {
              Authorization: `Bearer ${tokenObj.token}`
            }
          }
        );
  
        // Filter bookings by room ID
        const bookingsForRoom = bookingsResponse.data.filter(
          booking => booking.roomID === parseInt(roomId)
        );
  
        if (!bookingsForRoom || bookingsForRoom.length === 0) {
          throw new Error('No booking found for this room');
        }
  
        // Get the latest booking for the room
        const bookingData = bookingsForRoom[0];
        setBooking(bookingData);
  
        // Get user details
        try {
          const userResponse = await axios.get(
            `https://localhost:7125/api/User/${bookingData.userID}`,
            {
              headers: {
                Authorization: `Bearer ${tokenObj.token}`
              }
            }
          );
          setUserData(userResponse.data);
        } catch (userErr) {
          console.error('Error fetching user details:', userErr);
        }
  
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
          <Title>
            <FaDoorOpen style={{ marginRight: '1rem' }} />
            Search Booking by Room ID
          </Title>
  
          <SearchSection>
            <SearchInput
              type="number"
              placeholder="Enter Room ID..."
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              min="1"
            />
            <SearchButton 
              onClick={handleSearch}
              disabled={!roomId || loading}
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
                <InfoLabel>Booking ID:</InfoLabel>
                <InfoValue>{booking.bookingID}</InfoValue>
              </InfoRow>
              <InfoRow>
                <FaUser />
                <InfoLabel>User Details:</InfoLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <InfoValue>ID: {booking.userID}</InfoValue>
                  {userData && (
                    <InfoValue style={{ color: '#666' }}>
                      Name: {userData.name || 'N/A'}
                    </InfoValue>
                  )}
                </div>
              </InfoRow>
              {userData && (
                <>
                  <InfoRow>
                    <FaEnvelope />
                    <InfoLabel>Contact:</InfoLabel>
                    <InfoValue>{userData.email || 'N/A'}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <FaPhone />
                    <InfoLabel>Phone:</InfoLabel>
                    <InfoValue>{userData.contactNumber || 'N/A'}</InfoValue>
                  </InfoRow>
                </>
              )}
              <InfoRow>
                <FaBed />
                <InfoLabel>Room ID:</InfoLabel>
                <InfoValue>{booking.roomID}</InfoValue>
              </InfoRow>
              <InfoRow>
                <FaCalendar />
                <InfoLabel>Dates:</InfoLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <InfoValue>Check-in: {formatDate(booking.checkInDate)}</InfoValue>
                  <InfoValue>Check-out: {formatDate(booking.checkOutDate)}</InfoValue>
                </div>
              </InfoRow>
              <InfoRow>
                <FaCheckCircle />
                <InfoLabel>Status:</InfoLabel>
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
  
  export default GetBookingByRoom;