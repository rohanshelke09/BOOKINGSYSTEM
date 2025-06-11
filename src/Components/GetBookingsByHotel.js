import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaArrowLeft, FaCalendarAlt, FaBed, FaUser } from 'react-icons/fa';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin: 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #6c757d;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

const BookingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const BookingCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: ${props => {
    switch (props.$status?.toLowerCase()) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }};
  color: white;
`;

const BookingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  color: #2c3e50;

  svg {
    color: #007bff;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;
const StatusSelect = styled.select`
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  color: #2c3e50;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #007bff;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;
const FilterButton = styled.button`
  padding: 8px 16px;
  border: 2px solid #007bff;
  border-radius: 20px;
  background: ${props => props.$active ? '#007bff' : 'white'};
  color: ${props => props.$active ? 'white' : '#007bff'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #007bff;
    color: white;
  }
`;

const GetBookingsByHotel = () => {
  const { hotelID } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const tokenObj = token ? JSON.parse(token) : null;

        if (!tokenObj?.token) {
          throw new Error('Authentication required');
        }

        const response = await axios.get(
          `https://localhost:7125/api/Bookings/Hotel/${hotelID}`,
          {
            headers: {
              Authorization: `Bearer ${tokenObj.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        setBookings(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [hotelID]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingStatus(bookingId);
    try {
      const token = localStorage.getItem('token');
      const tokenObj = token ? JSON.parse(token) : null;
  
      if (!tokenObj?.token) {
        throw new Error('Authentication required');
      }
  
      const response = await axios.patch(
        `https://localhost:7125/api/Bookings/${bookingId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${tokenObj.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.status === 200) {
        // Update local state
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking.bookingID === bookingId
              ? { ...booking, status: newStatus }
              : booking
          )
        );
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('Failed to update booking status');
    } finally {
    setUpdatingStatus(null);
  }
  };
  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PageContainer>
      <Header>
        <Title>Hotel Bookings</Title>
        <BackButton onClick={() => navigate('/manager-dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </BackButton>
      </Header>

      <FilterSection>
        <FilterButton 
          $active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All Bookings
        </FilterButton>
        <FilterButton 
          $active={filter === 'confirmed'} 
          onClick={() => setFilter('confirmed')}
        >
          Confirmed
        </FilterButton>
        <FilterButton 
          $active={filter === 'pending'} 
          onClick={() => setFilter('pending')}
        >
          Pending
        </FilterButton>
        <FilterButton 
          $active={filter === 'cancelled'} 
          onClick={() => setFilter('cancelled')}
        >
          Cancelled
        </FilterButton>
      </FilterSection>

      <BookingsGrid>
        {filteredBookings.length > 0 ? (
          filteredBookings
            .sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate))
            .map(booking => (
              <BookingCard key={booking.bookingID}>
                <BookingInfo>
                  <FaUser />
                  <strong>Booking #{booking.bookingID}</strong>
                </BookingInfo>
                <BookingInfo>
                  <FaBed />
                  <span>Room: {booking.roomID || 'Not assigned'}</span>
                </BookingInfo>
                <BookingInfo>
                  <FaCalendarAlt />
                  <div>
                    <div>Check-in: {formatDate(booking.checkInDate)}</div>
                    <div>Check-out: {formatDate(booking.checkOutDate)}</div>
                  </div>
                </BookingInfo>
                <BookingInfo>
  <strong>Status: </strong>
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <StatusBadge $status={booking.status}>
      {booking.status}
    </StatusBadge>
    <StatusSelect
  value={booking.status}
  onChange={(e) => handleStatusChange(booking.bookingID, e.target.value)}
  disabled={updatingStatus === booking.bookingID}
>
  <option value="Confirmed">Confirmed</option>
  <option value="Pending">Pending</option>
  <option value="Cancelled">Cancelled</option>
</StatusSelect>
{updatingStatus === booking.bookingID && (
  <span style={{ color: '#007bff', fontSize: '0.875rem' }}>
    Updating...
  </span>
)}
  </div>
</BookingInfo>
              </BookingCard>
            ))
        ) : (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#6c757d' }}>
            No bookings found for this filter
          </p>
        )}
      </BookingsGrid>
    </PageContainer>
  );
};

export default GetBookingsByHotel;