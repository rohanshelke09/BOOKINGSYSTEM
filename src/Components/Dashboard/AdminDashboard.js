import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import UseAdminDashboard from '../UseAdminDashboard';
import DashboardCard from '../DashboardCard';

const DashboardContainer = styled.div`
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
  }

  h1 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 15px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    letter-spacing: -0.5px;
  }

  p {
    font-size: 1.25rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
  padding: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
`;

const StatItem = styled.div`
  text-align: center;
  padding: 12px 24px;
  border-radius: 12px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  .count {
    font-size: 2rem;
    font-weight: 700;
    color: #1e40af;
    margin-bottom: 4px;
  }

  .label {
    font-size: 0.95rem;
    color: #6b7280;
    font-weight: 500;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.$primary ? '#4f46e5' : '#ffffff'};
  color: ${props => props.$primary ? '#ffffff' : '#4f46e5'};
  border: 2px solid #4f46e5;
  padding: 14px 28px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1rem;
  width: 100%;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(79, 70, 229, 0.2);
    background: ${props => props.$primary ? '#4338ca' : '#f5f3ff'};
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  font-size: 1.2rem;
  color: #6b7280;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  margin: 20px auto;
  max-width: 500px;
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showUserOptions, setShowUserOptions] = useState(false);
  const { 
    users, guests, managers, hotels, 
    bookings, reviews, loading, error 
  } = UseAdminDashboard();

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingState>
          Loading dashboard data...
        </LoadingState>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </DashboardContainer>
    );
  }

  const dashboardItems = [
    {
      title: 'Users Management',
      stats: [
        { label: 'Guests', count: guests.length },
        { label: 'Managers', count: managers.length }
      ],
      count:guests.length+managers.length,
      color: 'blue',
      bgColor: '#ebf5ff',
      actions: [
        { label: 'Manage Guests', path: '/manage-guests', primary: true },
        { label: 'Manage Managers', path: '/manage-managers', primary: false }
      ]
    },
    {
      title: 'Total Hotels',
      count: hotels.length,
      color: 'green',
      bgColor: '#f0fff4',
      path: '/manage-hotels'
    },
    {
      title: 'Total Bookings',
      count: bookings.length,
      color: 'blue',
      bgColor: '#ebf5ff',
      path: '/manage-bookings'
    },
    {
      title: 'Total Reviews',
      count: reviews.length,
      color: 'purple',
      bgColor: '#faf5ff',
      path: '/manage-reviews'
    }
  ];

  return (
    <DashboardContainer>
      <WelcomeSection>
        <h1>Welcome to Admin Dashboard</h1>
        <p>Manage your hotel system efficiently with our comprehensive admin tools</p>
      </WelcomeSection>

      <CardGrid>
        {dashboardItems.map((item) => (
          <DashboardCard
            key={item.title}
            title={item.title}
            count={item.count}
            color={item.color}
            bgColor={item.bgColor}
          >
            {item.stats ? (
              <>
                <StatsContainer>
                  {item.stats.map(stat => (
                    <StatItem key={stat.label}>
                      <div className="count">{stat.count}</div>
                      <div className="label">{stat.label}</div>
                    </StatItem>
                  ))}
                </StatsContainer>
                {item.actions.map((action) => (
                  <ActionButton
                    key={action.label}
                    $primary={action.primary}
                    onClick={() => navigate(action.path)}
                    style={{ marginBottom: '12px' }}
                  >
                    {action.label}
                  </ActionButton>
                ))}
              </>
            ) : (
              <ActionButton 
                onClick={() => navigate(item.path)}
                $primary
              >
                Manage {item.title.split(' ')[1]}
              </ActionButton>
            )}
          </DashboardCard>
        ))}
      </CardGrid>
    </DashboardContainer>
  );
};

export default AdminDashboard;