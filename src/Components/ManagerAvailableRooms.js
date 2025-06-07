import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaBed, FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
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
`;

const DateSection = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
`;

const DateInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    color: #2c3e50;
    font-weight: 500;
  }

  input {
    padding: 0.75rem;
    border: 1px solid #cbd5e0;
    border-radius: 8px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    }
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #2980b9;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const RoomCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid ${props => props.$isAvailable ? '#4caf50' : '#f44336'};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
`;

const RoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const RoomType = styled.h3`
  margin: 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  background-color: ${props => props.$isAvailable ? '#e8f5e9' : '#ffebee'};
  color: ${props => props.$isAvailable ? '#2e7d32' : '#c62828'};
`;

const RoomInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #2c3e50;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  margin: 1rem 0;
  padding: 1rem;
  background: #ffebee;
  border-radius: 8px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #3498db;
  padding: 2rem;
`;

const ManagerAvailableRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dates, setDates] = useState({
    checkIn: '',
    checkOut: ''
  });
  const { hotelID } = useParams();

  const handleSearch = async () => {
    if (!dates.checkIn || !dates.checkOut) {
      setError('Please select both check-in and check-out dates');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const tokenObj = token ? JSON.parse(token) : null;

      if (!tokenObj?.token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        `https://localhost:7125/api/Rooms/AvailableRooms/${hotelID}?checkInDate=${dates.checkIn}&checkOutDate=${dates.checkOut}`,
        {
          headers: {
            Authorization: `Bearer ${tokenObj.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setRooms(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err.response?.data?.message || 'Failed to fetch available rooms');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Title>Check Room Availability</Title>

        <DateSection>
          <DateInput>
            <label>Check-in Date</label>
            <input
              type="date"
              value={dates.checkIn}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
            />
          </DateInput>
          <DateInput>
            <label>Check-out Date</label>
            <input
              type="date"
              value={dates.checkOut}
              min={dates.checkIn || new Date().toISOString().split('T')[0]}
              onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
            />
          </DateInput>
          <SearchButton 
            onClick={handleSearch}
            disabled={!dates.checkIn || !dates.checkOut || loading}
          >
            <FaSearch />
            {loading ? 'Searching...' : 'Search Rooms'}
          </SearchButton>
        </DateSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {loading ? (
          <LoadingMessage>Loading available rooms...</LoadingMessage>
        ) : (
          <RoomGrid>
            {rooms.map(room => (
              <RoomCard key={room.roomId} $isAvailable={room.availability}>
                <RoomHeader>
                  <RoomType>
                    <FaBed />
                    Room {room.roomID}
                  </RoomType>
                  <StatusBadge $isAvailable={room.availability}>
                    {room.availability ? (
                      <>
                        <FaCheckCircle />
                        Available
                      </>
                    ) : (
                      <>
                        <FaTimesCircle />
                        Occupied
                      </>
                    )}
                  </StatusBadge>
                </RoomHeader>
                <RoomInfo>
                  <span>Type: {room.type}</span>
                  <span>Price: ₹{room.price} per night</span>
                  <p>Features: {room.features}</p>
                </RoomInfo>
              </RoomCard>
            ))}
            {!loading && rooms.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center' }}>
                No rooms available for the selected dates.
              </div>
            )}
          </RoomGrid>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default ManagerAvailableRooms;