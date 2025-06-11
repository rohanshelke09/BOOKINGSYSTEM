import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaCalendar, 
  FaBed, 
  FaSearch,
  FaCheckCircle,
  FaClock 
} from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

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
  font-size: 2.5rem;
  font-weight: 600;
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
    background: linear-gradient(to right, #3498db, #2ecc71);
    border-radius: 2px;
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #95a5a6;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    }

    &::placeholder {
      color: #95a5a6;
    }
  }
`;

const GuestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const GuestCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, #3498db, #2ecc71);
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
`;

const GuestInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .info-item {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: #2c3e50;
    padding: 0.5rem;
    border-radius: 8px;
    background: #f8f9fa;

    svg {
      color: #3498db;
      font-size: 1.2rem;
    }
  }
`;

const BookingDetails = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px dashed #e0e0e0;

  .booking-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .booking-dates {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #2c3e50;
  }

  .date-item {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    label {
      font-size: 0.8rem;
      color: #666;
      font-weight: 500;
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  background-color: ${props => 
    props.$status === 'Active' ? '#e8f5e9' :
    props.$status === 'Upcoming' ? '#e3f2fd' : '#fff3e0'};
  color: ${props => 
    props.$status === 'Active' ? '#2e7d32' :
    props.$status === 'Upcoming' ? '#1565c0' : '#f57c00'};
  border: 1px solid ${props => 
    props.$status === 'Active' ? '#81c784' :
    props.$status === 'Upcoming' ? '#64b5f6' : '#ffb74d'};
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 1.5rem;
  background: #ffebee;
  border-radius: 12px;
  margin: 1rem 0;
  border: 1px solid #ffcdd2;
  font-weight: 500;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #3498db;
  padding: 2rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  &::after {
    content: '';
    width: 20px;
    height: 20px;
    border: 3px solid #3498db;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const NoGuestsMessage = styled.div`
  grid-column: 1/-1;
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 12px;
  color: #2c3e50;
  font-size: 1.2rem;
  border: 2px dashed #e0e0e0;
`;

const ViewGuests = () => {
  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { hotelID } = useParams();

  useEffect(() => {
    const filtered = guests.filter(guest =>
      guest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.contact?.includes(searchTerm)
    );
    setFilteredGuests(filtered);
  }, [searchTerm, guests]);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const token = localStorage.getItem('token');
        const tokenObj = token ? JSON.parse(token) : null;

        if (!tokenObj?.token) {
          throw new Error('Authentication required');
        }

        const decodedToken = jwtDecode(tokenObj.token);
        const managerId = decodedToken.nameid?.[0];

        if (!managerId) {
          throw new Error('Manager ID not found');
        }

        const hotelResponse = await axios.get(
          `https://localhost:7125/api/Hotels/by-manager/${managerId}`,
          {
            headers: {
              Authorization: `Bearer ${tokenObj.token}`
            }
          }
        );

        if (!hotelResponse.data || !hotelResponse.data.hotelID) {
          throw new Error('No hotel found for this manager');
        }

        const managerHotelId = hotelResponse.data.hotelID;


        const bookingsResponse = await axios.get(
          `https://localhost:7125/api/Bookings/Hotel/${managerHotelId}`,
          {
            headers: {
              Authorization: `Bearer ${tokenObj.token}`
            }
          }
        );

        if (!bookingsResponse.data || !Array.isArray(bookingsResponse.data)) {
          setGuests([]);
          return;
        }

        const guestPromises = bookingsResponse.data.map(booking =>
          axios.get(`https://localhost:7125/api/User/${booking.userID}`, {
            headers: {
              Authorization: `Bearer ${tokenObj.token}`
            }
          })
        );

        const guestResponses = await Promise.all(guestPromises);

        const guestData = bookingsResponse.data.map((booking, index) => ({
          ...guestResponses[index].data,
          checkIn: booking.checkInDate,
          checkOut: booking.checkOutDate,
          contact: guestResponses[index].data.contactNumber,
          bookingId: booking.bookingId,
          roomId: booking.roomID,
          status: booking.status
        }));

        setGuests(guestData);
        setFilteredGuests(guestData);
        setError(null);
      } catch (err) {
        console.error('Error fetching guests:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch guest information');
        setGuests([]);
        setFilteredGuests([]);
      } finally {
        setLoading(false);
      }
    };

    if (hotelID) {
      fetchGuests();
    }
  }, [hotelID]);

  const getBookingStatus = (checkIn, checkOut, status) => {
    const now = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (now >= checkInDate && now <= checkOutDate) {
      return 'Active';
    } else if (now < checkInDate) {
      return 'Upcoming';
    } else {
      return 'Past';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <LoadingMessage>Loading guest information...</LoadingMessage>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ContentWrapper>
          <ErrorMessage>{error}</ErrorMessage>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <Title>Hotel Guests</Title>
        
        <SearchContainer>
            <FaSearch />
            <input
                type="text"
                placeholder="Search by name, email or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </SearchContainer>

        <GuestGrid>
          {filteredGuests.length > 0 ? (
            filteredGuests.map(guest => {
              const bookingStatus = getBookingStatus(guest.checkIn, guest.checkOut);
              return (
                <GuestCard key={guest.bookingId}>
                  <GuestInfo>
                    <div className="info-item">
                      <FaUser />
                      <span>{guest.name}</span>
                    </div>
                    <div className="info-item">
                      <FaPhone />
                      <span>{guest.contact}</span>
                    </div>
                    <div className="info-item">
                      <FaEnvelope />
                      <span>{guest.email}</span>
                    </div>
                    <BookingDetails>
                      <div className="booking-header">
                        <div className="info-item">
                          <FaBed />
                          <span>Room #{guest.roomId}</span>
                        </div>
                        <StatusBadge $status={bookingStatus}>
                          {bookingStatus === 'Active' ? <FaCheckCircle /> :
                           bookingStatus === 'Upcoming' ? <FaClock /> :
                           <FaCalendar />}
                          {bookingStatus}
                        </StatusBadge>
                      </div>
                      <div className="booking-dates">
                        <div className="date-item">
                          <label>Check-in</label>
                          <span>{formatDate(guest.checkIn)}</span>
                        </div>
                        <div className="date-item">
                          <label>Check-out</label>
                          <span>{formatDate(guest.checkOut)}</span>
                        </div>
                      </div>
                    </BookingDetails>
                  </GuestInfo>
                </GuestCard>
              );
            })
          ) : (
            <NoGuestsMessage>
              {searchTerm ? 'No guests found matching your search.' : 'No guests found for this hotel.'}
            </NoGuestsMessage>
          )}
        </GuestGrid>
      </ContentWrapper>
    </PageContainer>
  );
};

export default ViewGuests;