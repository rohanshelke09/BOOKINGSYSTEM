import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHotel, FaUsers, FaChartLine, FaDollarSign, 
  FaBed, FaCalendarCheck 
} from 'react-icons/fa';
import UseHotelDashboard from '../UseHotelDashboard';
import StatsCard from '../StatsCard';
import BookingList from '../BookingList';
import QuickActions from '../QuickActions';
import styled from 'styled-components';
import GetRoomsByHotel from '../GetRoomsByHotel';

export const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
`;

export const WelcomeSection = styled.div`
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

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ErrorDisplay = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 2rem;
  border-radius: 15px;
  margin: 2rem auto;
  max-width: 600px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);

  h2 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
`;

const LoadingDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  font-size: 1.2rem;
  color: #6b7280;
`;

const ManagerDashboard = () => {
  const { 
    hotelDetails, 
    bookings, 
    hotelID, 
    stats, 
    loading, 
    error 
  } = UseHotelDashboard();
  const navigate = useNavigate();

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingDisplay>Loading dashboard data...</LoadingDisplay>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <ErrorDisplay>
          <h2>Dashboard Error</h2>
          <p>{error}</p>
        </ErrorDisplay>
      </DashboardContainer>
    );
  }

  const statsCards = [
    {
      icon: FaCalendarCheck,
      label: "Total Bookings",
      value: stats.totalBookings,
      color: "#2193b0"
    },
    // {
    //   icon: FaChartLine,
    //   label: "Occupancy Rate",
    //   value: `${stats.occupancyRate}%`,
    //   color: "#00b894"
    // },
    // {
    //   icon: FaDollarSign,
    //   label: "Total Revenue",
    //   value: `$${stats.revenue.toLocaleString()}`,
    //   color: "#00cec9"
    // },
    {
      icon: FaBed,
      label: "Available Rooms",
      value: stats.availableRooms,
      color: "#6c5ce7"
    }
  ];

  return (
    <DashboardContainer>
      <WelcomeSection>
        <h1>Hotel Manager Dashboard</h1>
        <p>Welcome back! Here's your hotel's performance overview</p>
        {hotelDetails && (
          <p>Managing: {hotelDetails.name} - {hotelDetails.location}</p>
        )}
      </WelcomeSection>

      <StatsGrid>
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </StatsGrid>

      <ContentGrid>
        <BookingList 
          bookings={bookings} 
          loading={loading} 
          onBookingClick={(id) => navigate(`/bookings/${id}`)}
          onViewAllClick={() => navigate('/bookings')}
        />
        
        <QuickActions 
          hotelID={hotelID}
          onActionClick={(path) => navigate(path)}
        />
      </ContentGrid>
      
    </DashboardContainer>
  );
};

export default ManagerDashboard;



