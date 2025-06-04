import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaHotel, FaUsers, FaChartLine, FaDollarSign, FaBed, FaCalendarCheck } from 'react-icons/fa';

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #2193b0, #6dd5ed);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);

  h1 {
    margin: 0;
    font-size: 2rem;
  }

  p {
    margin: 0.5rem 0 0;
    opacity: 0.9;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
  }

  .icon {
    font-size: 2rem;
    color: ${props => props.iconColor || '#2193b0'};
    margin-bottom: 1rem;
  }

  .label {
    color: #6c757d;
    font-size: 0.9rem;
  }

  .value {
    font-size: 1.8rem;
    font-weight: bold;
    color: #2d3436;
    margin: 0.5rem 0;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  h3 {
    color: #2d3436;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const BookingCard = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  border: 1px solid #e9ecef;

  &:hover {
    transform: translateX(5px);
    border-color: #2193b0;
  }

  .booking-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    background: ${props => {
      switch (props.status?.toLowerCase()) {
        case 'confirmed': return '#d4edda';
        case 'pending': return '#fff3cd';
        case 'cancelled': return '#f8d7da';
        default: return '#e2e3e5';
      }
    }};
    color: ${props => {
      switch (props.status?.toLowerCase()) {
        case 'confirmed': return '#155724';
        case 'pending': return '#856404';
        case 'cancelled': return '#721c24';
        default: return '#383d41';
      }
    }};
  }
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'outline' ? 'transparent' : '#2193b0'};
  color: ${props => props.variant === 'outline' ? '#2193b0' : 'white'};
  border: ${props => props.variant === 'outline' ? '1px solid #2193b0' : 'none'};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;
  margin-bottom: 0.5rem;

  &:hover {
    background: ${props => props.variant === 'outline' ? '#e3f2fd' : '#1b7a94'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ManagerDashboard = () => {
  const { hotelID } = useParams();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    occupancyRate: 0,
    revenue: 0,
    availableRooms: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const tokenObj = token ? JSON.parse(token) : null;
       
        const response = await axios.get('https://localhost:7125/api/Bookings', {
          headers: {
            Authorization: `Bearer ${tokenObj?.token}`,
            'Content-Type': 'application/json'
          }
        });
 
        setBookings(response.data);
        setStats({
          totalBookings: response.data.length,
          occupancyRate: calculateOccupancyRate(response.data),
          revenue: calculateTotalRevenue(response.data)
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
 
    fetchData();
  }, []);
 
  const calculateOccupancyRate = (bookings) => {
    // Add your occupancy rate calculation logic here
    return (bookings.filter(b => b.status === 'Confirmed').length / bookings.length * 100).toFixed(1);
  };
 
  const calculateTotalRevenue = (bookings) => {
    return bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
  };
 
  return (
    <DashboardContainer>
      <WelcomeSection>
        <h1>Hotel Manager Dashboard</h1>
        <p>Welcome back! Here's your hotel's performance overview</p>
      </WelcomeSection>

      <StatsGrid>
        <StatCard iconColor="#2193b0">
          <FaCalendarCheck className="icon" />
          <div className="label">Total Bookings</div>
          <div className="value">{stats.totalBookings}</div>
        </StatCard>

        <StatCard iconColor="#00b894">
          <FaChartLine className="icon" />
          <div className="label">Occupancy Rate</div>
          <div className="value">{stats.occupancyRate}%</div>
        </StatCard>

        <StatCard iconColor="#00cec9">
          <FaDollarSign className="icon" />
          <div className="label">Total Revenue</div>
          <div className="value">${stats.revenue.toLocaleString()}</div>
        </StatCard>

        <StatCard iconColor="#6c5ce7">
          <FaBed className="icon" />
          <div className="label">Available Rooms</div>
          <div className="value">{stats.availableRooms}</div>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <Card>
          <h3><FaCalendarCheck /> Recent Bookings</h3>
          {loading ? (
            <p>Loading bookings...</p>
          ) : bookings.length > 0 ? (
            bookings.slice(0, 5).map(booking => (
              <BookingCard 
                key={booking.bookingId} 
                status={booking.status}
                onClick={() => navigate(`/bookings/${booking.bookingID}`)}
              >
                <div className="booking-header">
                  <strong>Room {booking.room.number}</strong>
                  <span className="status">{booking.status}</span>
                </div>
                <p>Guest: {booking.user.name}</p>
                <p>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
              </BookingCard>
            ))
          ) : (
            <p>No recent bookings</p>
          )}
          <ActionButton variant="outline" onClick={() => navigate('/bookings')}>
            View All Bookings
          </ActionButton>
        </Card>

        <Card>
          <h3><FaHotel /> Quick Actions</h3>
          <ActionButton onClick={() => navigate(`/hotels/${hotelID}/rooms`)}>
            <FaBed /> Manage Rooms
          </ActionButton>
          <ActionButton onClick={() => navigate(`/hotels/${hotelID}/bookings`)}>
            <FaCalendarCheck /> View All Bookings
          </ActionButton>
          <ActionButton onClick={() => navigate(`/hotels/${hotelID}/guests`)}>
            <FaUsers /> Manage Guests
          </ActionButton>
        </Card>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default ManagerDashboard;