import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import GetHotelsById from './GetHotelById';
import Booking from './Booking';
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
              url('/Images/362619.jpg');
  background-size: cover;
  background-attachment: fixed;
  padding: 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const RoomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
  padding: 20px;
`;

const RoomCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
  }
`;


const RoomImage = styled.div`
  height: 100px;
  background: linear-gradient(45deg,rgba(255, 234, 0, 0.08),rgba(248, 1, 1, 0.13));
  position: relative;
`;

const RoomContent = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
`;

const RoomType = styled.h3`
  color:rgb(1, 132, 93);
  margin-bottom: 10px;
  font-size: 1.1rem;
`;

const RoomFeature = styled.p`
  margin: 5px 0;
  color: #555;
  display: flex;
  align-items: center;
  gap: 5px;
`;



const LoadingSpinner = styled.div`
  text-align: center;
  color: white;
  padding: 40px;

  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255,255,255,0.3);
    border-top: 5px solid white;
    border-radius: 50%;
    margin: 20px auto;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const GetAvailableRooms = () => {
    const { hotelID, checkIn, checkOut } = useParams();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [bookedRooms, setBookedRooms] = useState(new Set());

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(
                    `https://localhost:7125/api/Rooms/AvailableRooms/${hotelID}`,
                    {
                        params: { 
                            checkInDate: checkIn, 
                            checkOutDate: checkOut 
                        }
                    }
                );

                setRooms(response.data);
            } catch (error) {
                setError(error.response?.data || 'Failed to fetch rooms');
            } finally {
                setLoading(false);
            }
        };

        if (hotelID && checkIn && checkOut) {
            fetchRooms();
        }
    }, [hotelID, checkIn, checkOut]);


    const handleBookingComplete = (room) => {
        setBookedRooms(prev => new Set([...prev, room.roomID]));
    };

    if (loading) {
        return (
            <PageContainer>
                <LoadingSpinner>
                    <div className="spinner" />
                    <p>Loading available rooms...</p>
                </LoadingSpinner>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <ContentWrapper>
                    <div style={{ color: "white", textAlign: "center" }}>
                        {error}
                    </div>
                </ContentWrapper>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <ContentWrapper>
                <GetHotelsById hotelID={hotelID} isEmbedded={true} 
                embeddedCheckIn={checkIn}
                embeddedCheckOut={checkOut}/>

                {rooms.length > 0 ? (
                    <RoomsGrid>
                        {rooms.map(room => (
                            <RoomCard key={room.roomID}>
                                <RoomImage />
                                <RoomContent>
                                    <RoomType>Room {room.roomID} - {room.type}</RoomType>
                                    <RoomFeature>
                                        <span>💰</span>
                                        <strong>${room.price}</strong> per night
                                    </RoomFeature>
                                    <RoomFeature>
                                        <span>✨</span>
                                        {room.features}
                                    </RoomFeature>
                                    <Booking
                                        roomID={room.roomID}
                                        price={room.price}
                                        checkIn={checkIn}
                                        checkOut={checkOut}
                                        onBookingComplete={() => handleBookingComplete(room.roomID)}
                                    />
                                </RoomContent>
                            </RoomCard>
                        ))}
                    </RoomsGrid>
                ) : (
                    <div style={{ textAlign: "center", color: "white", marginTop: "40px" }}>
                        <h3>No available rooms found for the selected dates.</h3>
                    </div>
                )}
            </ContentWrapper>
        </PageContainer>
    );
};

export default GetAvailableRooms;