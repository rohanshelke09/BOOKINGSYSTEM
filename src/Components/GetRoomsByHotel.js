import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const RoomContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const RoomCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1.5rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    color: #2193b0;
    margin: 0 0 1rem 0;
  }

  .room-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .status {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    background: ${props => props.$isAvailable ? '#4caf50' : '#f44336'};
    color: white;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .price {
    font-size: 1.25rem;
    font-weight: bold;
    color: #2d3436;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  padding: 1rem;
  background: #ffebee;
  border-radius: 8px;
  margin: 1rem 0;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #2193b0;
`;

const GetRoomsByHotel = ( {hotelID}) => {
    const hotelId = localStorage.getItem('hotelID');
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        console.log('GetRoomsByHotel mounted with hotelID:', hotelId);
        if (!hotelId) {
          setError('Hotel ID is required');
          setLoading(false);
          return;
        }
    
        const fetchRooms = async () => {
          try {
            
            const token = localStorage.getItem('token');
            const tokenObj = token ? JSON.parse(token) : null;
    
            if (!tokenObj?.token) {
              throw new Error('Authentication required');
            }
    
            const response = await axios.get(
              `https://localhost:7125/api/Rooms/${hotelId}/rooms`,
              {
                headers: {
                  Authorization: `Bearer ${tokenObj.token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            console.log('API Response:', response.data);
    
            if (!response.data) {
              throw new Error('No data received from API');
            }
    
            setRooms(Array.isArray(response.data) ? response.data : []);
            setError(null);
          } catch (err) {
            console.error('Error fetching rooms:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch rooms');
            setRooms([]);
          } finally {
            setLoading(false);
          }
        };
    
        fetchRooms();
      }, [hotelID]);
    
  
    if (loading) {
      return <LoadingSpinner>Loading rooms...</LoadingSpinner>;
    }
  
    if (error) {
      return (
        <ErrorMessage>
          <h3>Error Loading Rooms</h3>
          <p>{error}</p>
          <p>Hotel ID: {hotelID}</p>
        </ErrorMessage>
      );
    }
  
    return (
      <RoomContainer>
        <h2>Hotel Rooms</h2>
        <RoomGrid>
          {rooms && rooms.length > 0 ? (
            rooms.map(room => (
              <RoomCard 
                key={room.roomID}
                $isAvailable={room.availability} 
              >
                <h3>Room {room.roomID}</h3>
                <div className="room-details">
                  <span>Type: {room.type}</span>
                  <span className="price">Price: ${room.price}</span>
                  <span className="status">
                  {room.availability ? (
                  <>
                    <FaCheckCircle />
                    Available
                  </>
                ) : (
                  <>
                    <FaTimesCircle />
                    Not Available
                  </>)}
                  </span>
                  <p>{room.features}</p>
                </div>
              </RoomCard>
            ))
          ) : (
            <p>No rooms available for this hotel.</p>
          )}
        </RoomGrid>
      </RoomContainer>
    );
  };
  export default GetRoomsByHotel;