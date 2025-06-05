import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import UseAdminDashboard from '../UseAdminDashboard';
import DashboardCard from '../DashboardCard';

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #2193b0, #6dd5ed);
  color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ActionButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showUserOptions, setShowUserOptions] = useState(false);
  const { 
    users, guests, managers, hotels, 
    bookings, reviews, loading, error 
  } = UseAdminDashboard();

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const dashboardItems = [
    {
      title: 'Total Users',
      count: users.length,
      color: 'blue',
      bgColor: '#ebf5ff',
      path: '/manage-users',
      actions: [
        { label: 'Manage Guests', path: '/manage-guests' },
        { label: 'Manage Managers', path: '/manage-managers' }
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
      color: 'yellow',
      bgColor: '#fffff0',
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
        <h1>Admin Dashboard</h1>
        <p>Manage Users, Hotels, Bookings, and Reviews</p>
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
            <ActionButton onClick={() => navigate(item.path)}>
              Manage {item.title.split(' ')[1]}
            </ActionButton>
            {item.actions && (
              <div className="mt-4">
                {item.actions.map((action) => (
                  <ActionButton
                    key={action.label}
                    onClick={() => navigate(action.path)}
                  >
                    {action.label}
                  </ActionButton>
                ))}
              </div>
            )}
          </DashboardCard>
        ))}
      </CardGrid>
    </DashboardContainer>
  );
};

export default AdminDashboard;