import React, { useEffect, useState } from "react";
import { useHotelManagement } from "../UseHotelManagement";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiTrash2, FiSearch, FiPlusCircle } from 'react-icons/fi';
import EditHotelModal from "../EditHotelModal";
import {
  PageContainer,
  HeaderSection,
  Title,
  ContentCard,
  Table,
  Th,
  Td,
  Tr,
  ActionButton,
  ButtonGroup,
  LoadingSpinner,
  Message
} from '../Styles/ManagePageStyles';
import styled from 'styled-components';

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background: #f8fafc;
  border-radius: 8px;

  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    outline: none;
    font-size: 0.95rem;

    &:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
    }

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

const ManageHotels = () => {
  const navigate = useNavigate();
  const { hotels, loading, error, fetchHotels, updateHotel, deleteHotel } = useHotelManagement();
  const [editingHotel, setEditingHotel] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const filteredHotels = hotels.filter(hotel => 
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (hotel) => {
    setEditingHotel(hotel);
    setSuccessMessage('');
  };

  const handleSaveEdit = async (updatedHotel) => {
    try {
      const result = await updateHotel(updatedHotel.hotelID, updatedHotel);
      if (result.success) {
        setSuccessMessage('Hotel updated successfully!');
        setEditingHotel(null);
        // Refresh the hotels list
        await fetchHotels();
      } else {
        throw new Error(result.error || 'Failed to update hotel');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteClick = async (hotelId) => {
    try {
      if (window.confirm("Are you sure you want to delete this hotel? This action cannot be undone.")) {
        const result = await deleteHotel(hotelId);
        if (result.success) {
          setSuccessMessage('Hotel deleted successfully!');
          // Refresh the hotels list
          await fetchHotels();
        } else {
          throw new Error(result.error || 'Failed to delete hotel');
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>Loading hotels...</LoadingSpinner>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Message $type="error">{error}</Message>
        <ActionButton onClick={() => navigate('/admin-dashboard')}>
          <FiArrowLeft /> Back to Dashboard
        </ActionButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <HeaderSection>
        <ButtonGroup>
          <ActionButton onClick={() => navigate('/admin-dashboard')}>
            <FiArrowLeft /> Back to Dashboard
          </ActionButton>
        </ButtonGroup>
        <Title>Manage Hotels</Title>
        <ButtonGroup>
          <ActionButton $primary onClick={() => setEditingHotel({})}>
            <FiPlusCircle /> Add New Hotel
          </ActionButton>
        </ButtonGroup>
      </HeaderSection>

      <ContentCard>
        <SearchBar>
          <input
            type="text"
            placeholder="Search hotels by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ActionButton>
            <FiSearch /> Search
          </ActionButton>
        </SearchBar>

        {successMessage && <Message $type="success">{successMessage}</Message>}

        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Location</Th>
              <Th>Amenities</Th>
              <Th>Manager ID</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredHotels.map((hotel) => (
              <Tr key={hotel.hotelID}>
                <Td>{hotel.hotelID}</Td>
                <Td>{hotel.name}</Td>
                <Td>{hotel.location}</Td>
                <Td>{hotel.amenities}</Td>
                <Td>{hotel.managerID}</Td>
                <Td>
                  <ButtonGroup>
                    <ActionButton onClick={() => handleEditClick(hotel)}>
                      <FiEdit2 /> Edit
                    </ActionButton>
                    <ActionButton $variant="danger" onClick={() => handleDeleteClick(hotel.hotelID)}>
                      <FiTrash2 /> Delete
                    </ActionButton>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </ContentCard>

      {editingHotel && (
        <EditHotelModal
          hotel={editingHotel}
          onSave={handleSaveEdit}
          onCancel={() => {
            setEditingHotel(null);
            setSuccessMessage('');
          }}
        />
      )}
    </PageContainer>
  );
};

export default ManageHotels;