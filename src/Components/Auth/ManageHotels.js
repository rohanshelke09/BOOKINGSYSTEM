import React, { useEffect, useState } from "react";
import { useHotelManagement } from "../UseHotelManagement";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiTrash2, FiSearch, FiPlusCircle } from 'react-icons/fi';
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
import axios from 'axios';

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

const EditModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 1001;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translate(-50%, -60%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%);
      opacity: 1;
    }
  }

  h2 {
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    text-align: center;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 1rem;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
`;

const ConfirmationModal = styled(EditModal)`
  max-width: 400px;
  padding: 2rem;

  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  p {
    color: #4b5563;
    margin-bottom: 1.5rem;
  }
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const EditFormGroup = styled.div`
  label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
    font-size: 1rem;
  }

  input, textarea {
    width: 100%;
    padding: 0.875rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.2s ease;
    background-color: #f9fafb;

    &:hover {
      border-color: #d1d5db;
    }

    &:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
      outline: none;
      background-color: white;
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const ModalButtons = styled(ButtonGroup)`
  margin-top: 2rem;
  justify-content: flex-end;
  gap: 1rem;

  button {
    min-width: 120px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    transition: all 0.2s ease;

    &:first-child {
      background-color: #f3f4f6;
      color: #4b5563;
      
      &:hover {
        background-color: #e5e7eb;
      }
    }

    &:last-child {
      background-color: #4f46e5;
      color: white;
      
      &:hover {
        background-color: #4338ca;
      }
    }
  }
`;

const ConfirmationModalButtons = styled(ModalButtons)`
  justify-content: space-between;
`;

const ManageHotels = () => {
  const navigate = useNavigate();
  const { hotels, loading, error: apiError, fetchHotels, deleteHotel } = useHotelManagement();
  const [editingHotel, setEditingHotel] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingHotel, setDeletingHotel] = useState(null);

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

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate inputs
      if (!editingHotel.name?.trim()) {
        setError('Hotel name is required');
        return;
      }
      if (!editingHotel.location?.trim()) {
        setError('Location is required');
        return;
      }
      if (!editingHotel.amenities?.trim()) {
        setError('Amenities are required');
        return;
      }
      if (!editingHotel.managerID) {
        setError('Manager ID is required');
        return;
      }

      const hotelData = {
        name: editingHotel.name.trim(),
        location: editingHotel.location.trim(),
        amenities: editingHotel.amenities.trim(),
        managerID: parseInt(editingHotel.managerID)
      };

      let response;
      if (editingHotel.hotelID) {
        // Update existing hotel using PATCH
        response = await axios.patch(
          `https://localhost:7125/api/Hotels/${editingHotel.hotelID}`,
          hotelData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Add new hotel
        response = await axios.post(
          'https://localhost:7125/api/Hotels',
          hotelData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      if (response.status === 200 || response.status === 201 || response.status === 204) {
        await fetchHotels(); // Refresh the hotels list
        setSuccessMessage(
          editingHotel.hotelID 
            ? `Hotel "${editingHotel.name}" updated successfully!` 
            : 'New hotel added successfully!'
        );
        setEditingHotel(null);
      }
    } catch (error) {
      console.error('Save error:', error);
      if (error.response?.status === 404) {
        setError('Hotel not found. It may have been deleted.');
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || 'Invalid hotel data. Please check all fields.');
      } else {
        setError('Failed to save hotel. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (hotel) => {
    setError('');
    setSuccessMessage('');
    setDeletingHotel(hotel);
  };

  const confirmDelete = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      const result = await deleteHotel(deletingHotel.hotelID);
      
      if (result.success) {
        setSuccessMessage(`Hotel "${deletingHotel.name}" has been successfully deleted`);
        await fetchHotels();
        setDeletingHotel(null);
      } else {
        throw new Error(result.error || 'Failed to delete hotel');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete hotel. Please try again.');
    } finally {
      setIsSubmitting(false);
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
          <ActionButton $primary onClick={() => {
            setEditingHotel({
              name: '',
              location: '',
              amenities: '',
              managerID: ''
            });
            setError('');
            setSuccessMessage('');
          }}>
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
            {filteredHotels.map(hotel => (
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
                    <ActionButton 
                      $variant="danger"
                      onClick={() => handleDeleteClick(hotel)}
                    >
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
        <>
          <Overlay onClick={() => setEditingHotel(null)} />
          <EditModal onClick={e => e.stopPropagation()}>
            <h2>{editingHotel.hotelID ? 'Edit Hotel' : 'Add New Hotel'}</h2>
            {error && <Message $type="error">{error}</Message>}
            <EditForm onSubmit={handleSaveEdit}>
              <EditFormGroup>
                <label>Hotel Name</label>
                <input
                  type="text"
                  value={editingHotel.name || ''}
                  onChange={e => setEditingHotel(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  required
                  placeholder="Enter hotel name"
                />
              </EditFormGroup>

              <EditFormGroup>
                <label>Location</label>
                <input
                  type="text"
                  value={editingHotel.location || ''}
                  onChange={e => setEditingHotel(prev => ({
                    ...prev,
                    location: e.target.value
                  }))}
                  required
                  placeholder="Enter hotel location"
                />
              </EditFormGroup>

              <EditFormGroup>
                <label>Amenities</label>
                <textarea
                  value={editingHotel.amenities || ''}
                  onChange={e => setEditingHotel(prev => ({
                    ...prev,
                    amenities: e.target.value
                  }))}
                  required
                  placeholder="Enter hotel amenities (comma separated)"
                />
              </EditFormGroup>

              <EditFormGroup>
                <label>Manager ID</label>
                <input
                  type="number"
                  value={editingHotel.managerID || ''}
                  onChange={e => setEditingHotel(prev => ({
                    ...prev,
                    managerID: e.target.value
                  }))}
                  required
                  placeholder="Enter manager ID"
                />
              </EditFormGroup>

              <ModalButtons>
                <ActionButton
                  type="button"
                  onClick={() => {
                    setEditingHotel(null);
                    setSuccessMessage('');
                  }}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  type="submit"
                  $variant="primary"
                >
                  {editingHotel.hotelID ? 'Save Changes' : 'Add Hotel'}
                </ActionButton>
              </ModalButtons>
            </EditForm>
          </EditModal>
        </>
      )}

      {deletingHotel && (
        <>
          <Overlay onClick={() => !isSubmitting && setDeletingHotel(null)} />
          <ConfirmationModal>
            <h3>Delete Hotel</h3>
            <p>
              Are you sure you want to delete {deletingHotel.name}? 
              This action cannot be undone.
            </p>
            {error && <Message $type="error">{error}</Message>}
            <ConfirmationModalButtons>
              <ActionButton
                type="button"
                onClick={() => setDeletingHotel(null)}
                disabled={isSubmitting}
              >
                Cancel
              </ActionButton>
              <ActionButton
                type="button"
                $variant="danger"
                onClick={confirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </ActionButton>
            </ConfirmationModalButtons>
          </ConfirmationModal>
        </>
      )}
    </PageContainer>
  );
};

export default ManageHotels;