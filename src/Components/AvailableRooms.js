import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
              url('/Images/room-bg.jpg');
  background-size: cover;
  background-attachment: fixed;
  padding: 40px 20px;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  padding: 30px;
`;

const Title = styled.h2`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #34495e;
    color: white;
    font-weight: 500;
  }

  tr:hover {
    background-color: #f8f9fa;
  }
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  margin: 20px auto;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  padding: 15px;
  margin: 20px 0;
  border-radius: 8px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  text-align: center;
`;

const NoRoomsMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #666;
  font-size: 1.1rem;
`;

const Price = styled.span`
  font-weight: 600;
  color: #2ecc71;
`;

const Status = styled.span`
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9em;
  font-weight: 500;
  background-color: ${props => props.$available ? '#d4edda' : '#f8d7da'};
  color: ${props => props.$available ? '#155724' : '#721c24'};
`;

const AvailableRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const decodedToken = jwtDecode(token);
                const managerId = decodedToken.nameid;

                // First get the hotel ID for this manager
                const hotelResponse = await axios.get(
                    `https://localhost:7125/api/Hotels/by-manager/${managerId}`,
                    { headers: { 'Authorization': `Bearer ${token}` }}
                );

                if (hotelResponse.data && hotelResponse.data.id) {
                    // Then fetch rooms for this hotel
                    const roomsResponse = await axios.get(
                        `https://localhost:7125/api/Rooms/${hotelResponse.data.id}`,
                        { headers: { 'Authorization': `Bearer ${token}` }}
                    );
                    
                    setRooms(roomsResponse.data);
                    setError(null);
                } else {
                    setError('No hotel found for this manager');
                }
            } catch (error) {
                setError('Error fetching rooms: ' + (error.response?.data || error.message));
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [token]);

    if (loading) {
        return (
            <PageContainer>
                <ContentContainer>
                    <LoadingSpinner />
                </ContentContainer>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <ContentContainer>
                    <Title>Available Rooms</Title>
                    <ErrorMessage>{error}</ErrorMessage>
                </ContentContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <ContentContainer>
                <Title>Available Rooms</Title>
                {rooms.length === 0 ? (
                    <NoRoomsMessage>No rooms found for this hotel.</NoRoomsMessage>
                ) : (
                    <div className="table-responsive">
                        <Table>
                            <thead>
                                <tr>
                                    <th>Room ID</th>
                                    <th>Type</th>
                                    <th>Price</th>
                                    <th>Features</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map(room => (
                                    <tr key={room.roomId}>
                                        <td>{room.roomId}</td>
                                        <td>{room.type}</td>
                                        <td><Price>${room.price}</Price></td>
                                        <td>{room.features}</td>
                                        <td>
                                            <Status $available={room.availability}>
                                                {room.availability ? 'Available' : 'Occupied'}
                                            </Status>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </ContentContainer>
        </PageContainer>
    );
};

export default AvailableRooms;