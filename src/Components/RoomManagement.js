import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaPencilAlt, FaTrash, FaList, FaArrowLeft,FaCalendarPlus,FaBed } from 'react-icons/fa';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0;
  font-size: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: #e0e0e0;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #d0d0d0;
    transform: translateX(-2px);
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const ActionCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }

  svg {
    font-size: 2.5rem;
    color: ${props => props.iconColor || '#3498db'};
    margin-bottom: 1rem;
  }

  h3 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  p {
    color: #7f8c8d;
    font-size: 0.9rem;
    margin: 0;
  }
`;

const RoomManagement = () => {
  const navigate = useNavigate();
  const { hotelID } = useParams();

  const actions = [
    {
      icon: FaPlus,
      title: "Add Room",
      description: "Create and configure new rooms for your hotel",
      iconColor: "#27ae60",
      path: `/hotel-rooms/${hotelID}/add`
    },
    {
      icon: FaPencilAlt,
      title: "Update Room",
      description: "Modify existing room details and settings",
      iconColor: "#f39c12",
      path: `/hotel-rooms/${hotelID}/update`
    },
    {
      icon: FaTrash,
      title: "Delete Room",
      description: "Remove rooms that are no longer needed",
      iconColor: "#e74c3c",
      path: `/hotel-rooms/${hotelID}/delete`
    },
    {
      icon: FaList,
      title: "View Rooms",
      description: "See all rooms and their current status",
      iconColor: "#3498db",
      path: `/hotel-rooms/${hotelID}`
    },
    {
      icon: FaCalendarPlus,
      title: "Book Room",
      description: "Create a new booking for available rooms",
      iconColor: "#9b59b6", 
      path: `/hotel-rooms/${hotelID}/book`
    },
    {
      icon: FaBed,
      title: "Available Rooms",
      description: "View all currently available rooms",
      iconColor: "#2ecc71", // Green color for availability
      path: `/hotel-rooms/${hotelID}/available`
    }
  ];

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <Title>
            Room Management
          </Title>
          <BackButton onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back to Dashboard
          </BackButton>
        </Header>

        <ActionGrid>
          {actions.map((action, index) => (
            <ActionCard 
              key={index} 
              onClick={() => navigate(action.path)}
              iconColor={action.iconColor}
            >
              <action.icon />
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </ActionCard>
          ))}
        </ActionGrid>
      </ContentWrapper>
    </PageContainer>
  );
};

export default RoomManagement;