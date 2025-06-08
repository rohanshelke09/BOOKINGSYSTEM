import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styled from 'styled-components';
import { FaHotel, FaUserAlt, FaBed, FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

// Styled Components
const PageWrapper = styled.div`
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    padding: 2rem;
`;

const StyledContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const PageHeader = styled.h2`
    color: #2c3e50;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e0e0e0;
    display: flex;
    align-items: center;
    gap: 1rem;
    
    svg {
        color: #3498db;
        font-size: 2rem;
    }
`;

const StyledCard = styled.div`
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    margin-bottom: 2rem;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
`;

const CardHeader = styled.div`
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    color: white;
    padding: 1.5rem;
    
    h4 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 500;
    }
`;

const CardBody = styled.div`
    padding: 2rem;
`;

const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 10px;
    margin-bottom: 1rem;
    transition: background 0.3s ease;
    
    &:hover {
        background: #edf2f7;
    }
    
    svg {
        color: #3498db;
        font-size: 1.2rem;
    }
`;

const Label = styled.span`
    font-weight: 600;
    color: #2c3e50;
    min-width: 120px;
`;

const Value = styled.span`
    color: #34495e;
`;

const StatusBadge = styled.span`
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    font-weight: 500;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const StyledSelect = styled.select`
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:focus {
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        outline: none;
    }
`;

const GetBookingByBookingId = () => {
    const [booking, setBooking] = useState(null);
    const [hotel, setHotel] = useState(null);
    const { bookingId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBookingAndHotel();
    }, [bookingId]);

    const fetchBookingAndHotel = async () => {
        try {
            const tokenObj = localStorage.getItem('token');
            const decodedToken = jwtDecode(tokenObj);
            const userId = decodedToken.nameid?.[0];

            if (!userId) {
                throw new Error('User ID not found in token');
            }

            const bookingResponse = await axios.get(`https://localhost:7125/api/Bookings/${bookingId}`, {
                headers: {
                    'Authorization': `Bearer ${tokenObj}`,
                    'Content-Type': 'application/json'
                }
            });
            setBooking(bookingResponse.data);

            const hotelResponse = await axios.get(`https://localhost:7125/api/Hotels/by-manager/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${tokenObj}`,
                    'Content-Type': 'application/json'
                }
            });
            setHotel(hotelResponse.data);
            
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch booking details');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            const tokenObj = localStorage.getItem('token');
            await axios.patch(`https://localhost:7125/api/Bookings/${bookingId}`, 
                { status: newStatus },
                { 
                    headers: {
                        'Authorization': `Bearer ${tokenObj}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            fetchBookingAndHotel();
        } catch (error) {
            console.error('Error updating status:', error);
            setError('Failed to update booking status');
        }
    };

    if (loading) return (
        <PageWrapper>
            <StyledContainer>
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </StyledContainer>
        </PageWrapper>
    );

    if (error) return (
        <PageWrapper>
            <StyledContainer>
                <div className="alert alert-danger" role="alert">{error}</div>
            </StyledContainer>
        </PageWrapper>
    );

    if (!booking) return (
        <PageWrapper>
            <StyledContainer>
                <div className="alert alert-warning" role="alert">Booking not found</div>
            </StyledContainer>
        </PageWrapper>
    );

    return (
        <PageWrapper>
            <StyledContainer>
                <PageHeader>
                    <FaHotel />
                    Booking Details
                </PageHeader>

                {hotel && (
                    <StyledCard>
                        <CardHeader>
                            <h4>Hotel Information</h4>
                        </CardHeader>
                        <CardBody>
                            <InfoGrid>
                                <InfoItem>
                                    <FaHotel />
                                    <Label>Hotel Name:</Label>
                                    <Value>{hotel.name}</Value>
                                </InfoItem>
                                <InfoItem>
                                    <FaMapMarkerAlt />
                                    <Label>Location:</Label>
                                    <Value>{hotel.location}</Value>
                                </InfoItem>
                            </InfoGrid>
                        </CardBody>
                    </StyledCard>
                )}

                <StyledCard>
                    <CardHeader>
                        <h4>Booking :{booking.bookingID}</h4>
                    </CardHeader>
                    <CardBody>
                        <InfoGrid>
                            <div>
                                <InfoItem>
                                    <FaUserAlt />
                                    <Label>Guest Name:</Label>
                                    <Value>{booking.user.name}</Value>
                                </InfoItem>
                                <InfoItem>
                                    <FaBed />
                                    <Label>Room Number:</Label>
                                    <Value>{booking.room.roomID}</Value>
                                </InfoItem>
                                <InfoItem>
                                    <FaCalendarAlt />
                                    <Label>Check In:</Label>
                                    <Value>{new Date(booking.checkInDate).toLocaleDateString()}</Value>
                                </InfoItem>
                                <InfoItem>
                                    <FaClock />
                                    <Label>Check Out:</Label>
                                    <Value>{new Date(booking.checkOutDate).toLocaleDateString()}</Value>
                                </InfoItem>
                            </div>
                            <div>
                                <InfoItem>
                                    <Label>Current Status:</Label>
                                    <StatusBadge className={`badge ${
                                        booking.status === 'Confirmed' ? 'bg-success' :
                                        booking.status === 'Pending' ? 'bg-warning' :
                                        booking.status === 'Cancelled' ? 'bg-danger' :
                                        'bg-secondary'
                                    }`}>
                                        {booking.status}
                                    </StatusBadge>
                                </InfoItem>
                                <InfoItem style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                    <Label style={{ marginBottom: '0.5rem' }}>Update Status:</Label>
                                    <StyledSelect
                                        value={booking.status}
                                        onChange={(e) => handleStatusUpdate(e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Completed">Completed</option>
                                    </StyledSelect>
                                </InfoItem>
                            </div>
                        </InfoGrid>
                    </CardBody>
                </StyledCard>
            </StyledContainer>
        </PageWrapper>
    );
};

export default GetBookingByBookingId;