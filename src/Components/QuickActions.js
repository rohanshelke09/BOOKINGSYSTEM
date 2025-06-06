import React from 'react';
import styled from 'styled-components';
import { useEffect } from 'react';
import { 
  FaPlus, 
  FaBed, 
  FaUsers, 
  FaCog, 
  FaChartBar 
} from 'react-icons/fa';

const QuickActionsContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  h3 {
    margin: 0 0 1rem 0;
    color: #2d3436;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.2rem;
  border: none;
  border-radius: 8px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.5rem;
    color: #2193b0;
    margin-bottom: 0.5rem;
  }

  span {
    font-size: 0.9rem;
    color: #495057;
    text-align: center;
  }
`;

const QuickActions = ({ hotelID, onActionClick }) => {
    useEffect(() => {
        // Debug log to track hotelID changes
        console.log('QuickActions received hotelID:', hotelID);
        localStorage.setItem('hotelID', hotelID);
        
      }, [hotelID]);
  const actions = [
    {
      icon: FaPlus,
      label: 'New Booking',
      path: `/hotel-details/${hotelID}`
    },
    {
      icon: FaBed,
      label: 'Manage Rooms',
      path: `/hotel-rooms/${hotelID}/manage`
    },
    {
      icon: FaUsers,
      label: 'View Guests',
      path: `/hotels/${hotelID}/guests`
    },
    {
      icon: FaChartBar,
      label: 'Reports',
      path: `/hotels/${hotelID}/reports`
    }
  ];

  return (
    <QuickActionsContainer>
      <h3><FaCog /> Quick Actions</h3>
      <ActionGrid>
        {actions.map((action, index) => (
          <ActionButton 
            key={index}
            onClick={() => onActionClick(action.path)}
          >
            <action.icon />
            <span>{action.label}</span>
          </ActionButton>
        ))}
      </ActionGrid>
    </QuickActionsContainer>
  );
};

export default QuickActions;