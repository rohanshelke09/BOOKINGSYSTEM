import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTrash2, FiEdit2, FiSearch } from 'react-icons/fi';
import axios from 'axios';
import styled from 'styled-components';
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
import EditGuestModal from '../EditGuestModal';

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

const ManageGuests = () => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingGuest, setEditingGuest] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:7125/api/User/by-role/guest', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setGuests(response.data);
        setError('');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      const errorMessage = err.response?.data?.message || 
                           'Failed to fetch guests. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (guest) => {
    setEditingGuest(guest);
    setSuccessMessage('');
  };

  const handleSaveEdit = async (updatedGuest) => {
    try {
      if (!updatedGuest.name || !updatedGuest.email || !updatedGuest.contactNumber) {
        window.alert('All fields are required');
        return;
      }

      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailRegex.test(updatedGuest.email)) {
        window.alert('Invalid email format. Example: xyz@mail.com');
        return;
      }

      const contactRegex = /^[0-9]{10}$/;
      if (!contactRegex.test(updatedGuest.contactNumber)) {
        window.alert('Contact number must be exactly 10 digits');
        return;
      }

      const updateData = {
        name: updatedGuest.name.trim(),
        email: updatedGuest.email.trim(),
        contactNumber: updatedGuest.contactNumber,
        role: "guest",
        password: ""
      };

      console.log('Sending update request:', updateData);

      const response = await axios.put(
        `https://localhost:7125/api/User/${updatedGuest.userID}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.status === 204) {
        setSuccessMessage('Guest updated successfully!');
        setEditingGuest(null);
        await fetchGuests();
      }
    } catch (err) {
      console.error('Update error:', err);
      let errorMessage = 'Failed to update guest. Please try again.';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'object') {
          const errors = Object.values(err.response.data);
          errorMessage = Array.isArray(errors) ? errors.join('\n') : err.response.data.message;
        } else {
          errorMessage = err.response.data;
        }
      }
      
      window.alert(errorMessage);
    }
  };

  const handleDeleteClick = async (userID) => {
    try {
      if (window.confirm("Are you sure you want to delete this guest? This action cannot be undone.")) {
        const response = await axios.delete(
          `https://localhost:7125/api/User/${userID}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.status === 204) {
          setSuccessMessage('Guest deleted successfully!');
          await fetchGuests();
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         'Failed to delete guest. Please try again.';
      window.alert(errorMessage);
    }
  };

  const filteredGuests = guests.filter(guest => 
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.contactNumber.includes(searchTerm)
  );

  if (loading) return (
    <PageContainer>
      <LoadingSpinner>Loading guests...</LoadingSpinner>
    </PageContainer>
  );

  return (
    <PageContainer>
      <HeaderSection>
        <ButtonGroup>
          <ActionButton onClick={() => navigate('/admin-dashboard')}>
            <FiArrowLeft /> Back to Dashboard
          </ActionButton>
        </ButtonGroup>
        <Title>Manage Guests</Title>
        <ButtonGroup>
          <div style={{ width: '120px' }} />
        </ButtonGroup>
      </HeaderSection>

      <ContentCard>
        {error && <Message $type="error">{error}</Message>}
        {successMessage && <Message $type="success">{successMessage}</Message>}

        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Contact</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.map((guest) => (
              <Tr key={guest.userID}>
                <Td>{guest.userID}</Td>
                <Td>{guest.name}</Td>
                <Td>{guest.email}</Td>
                <Td>{guest.contactNumber}</Td>
                <Td>
                  <ButtonGroup>
                    <ActionButton onClick={() => handleEditClick(guest)}>
                      <FiEdit2 /> Edit
                    </ActionButton>
                    <ActionButton $variant="danger" onClick={() => handleDeleteClick(guest.userID)}>
                      <FiTrash2 /> Delete
                    </ActionButton>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </ContentCard>

      {editingGuest && (
        <EditGuestModal
          guest={editingGuest}
          onSave={handleSaveEdit}
          onCancel={() => {
            setEditingGuest(null);
            setSuccessMessage('');
          }}
        />
      )}
    </PageContainer>
  );
};

export default ManageGuests;