import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTrash2, FiEdit2, FiSearch } from 'react-icons/fi';
import axios from 'axios';
import styled from 'styled-components';
import { getToken } from '../../Services/AuthService';
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
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 1001;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const EditFormGroup = styled.div`
  label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;

    &:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
      outline: none;
    }
  }
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 1001;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ConfirmationModalButtons = styled(ModalButtons)`
  margin-top: 2rem;
  justify-content: center;
  gap: 1rem;

  button {
    min-width: 120px;

    &:first-child {
      background-color: #4f46e5;
      color: white;
      
      &:hover {
        background-color: #4338ca;
      }
    }

    &:last-child {
      background-color: #ef4444;
      color: white;
      
      &:hover {
        background-color: #dc2626;
      }
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
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
  const [deletingGuest, setDeletingGuest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }

      const response = await axios.get(
        'https://localhost:7125/api/User/by-role/guest',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
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

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Input validation
      if (!editingGuest.name?.trim() || !editingGuest.email?.trim() || !editingGuest.contactNumber?.trim()) {
        setError('All fields are required');
        setIsSubmitting(false);
        return;
      }

      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailRegex.test(editingGuest.email)) {
        setError('Invalid email format');
        setIsSubmitting(false);
        return;
      }

      const contactRegex = /^[0-9]{10}$/;
      if (!contactRegex.test(editingGuest.contactNumber)) {
        setError('Contact number must be 10 digits');
        setIsSubmitting(false);
        return;
      }

      const updateData = {
        userID: editingGuest.userID,
        name: editingGuest.name.trim(),
        email: editingGuest.email.trim(),
        contactNumber: editingGuest.contactNumber.trim(),
        role: "guest"
      };

      const response = await axios.patch(
        `https://localhost:7125/api/User/${editingGuest.userID}`,
        updateData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 204) {
        // Update local state
        setGuests(prevGuests =>
          prevGuests.map(g =>
            g.userID === editingGuest.userID
              ? { ...g, ...updateData }
              : g
          )
        );
        setSuccessMessage(`Guest "${updateData.name}" updated successfully`);
        setEditingGuest(null);
      }
    } catch (err) {
      console.error('Update error:', err);
      if (err.response?.status === 404) {
        setError('Guest not found. They may have been deleted.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Invalid data provided');
      } else if (err.response?.status === 409) {
        setError('Email address is already in use');
      } else {
        setError('Failed to update guest. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (guest) => {
    setDeletingGuest(guest);
    setError('');
    setSuccessMessage('');
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage('');

      const token = getToken();
      if (!token) {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }

      const response = await axios.delete(
        `https://localhost:7125/api/User/${deletingGuest.userID}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 204) {
        setGuests(prevGuests => 
          prevGuests.filter(guest => guest.userID !== deletingGuest.userID)
        );
        setSuccessMessage(`Guest ${deletingGuest.name} was successfully deleted`);
        setDeletingGuest(null);
      }

    } catch (err) {
      console.error('Delete error details:', err.response || err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to delete guests');
      } else if (err.response?.status === 404) {
        setError('Guest not found. They may have already been deleted.');
        setDeletingGuest(null);
      } else {
        setError('Failed to delete guest. Please try again.');
      }
    } finally {
      setLoading(false);
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
                    {/* <ActionButton $variant="danger" onClick={() => handleDeleteClick(guest)}>
                      <FiTrash2 /> Delete
                    </ActionButton> */}
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </ContentCard>

      {editingGuest && (
        <>
          <Overlay onClick={() => !isSubmitting && setEditingGuest(null)} />
          <EditModal>
            <h2>Edit Guest</h2>
            {error && <Message $type="error">{error}</Message>}
            <EditForm onSubmit={handleSaveEdit}>
              <EditFormGroup>
                <label>Name</label>
                <input
                  type="text"
                  value={editingGuest.name || ''}
                  onChange={e => setEditingGuest(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  required
                />
              </EditFormGroup>
              <EditFormGroup>
                <label>Email</label>
                <input
                  type="email"
                  value={editingGuest.email || ''}
                  onChange={e => setEditingGuest(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  required
                />
              </EditFormGroup>
              <EditFormGroup>
                <label>Contact Number</label>
                <input
                  type="text"
                  value={editingGuest.contactNumber || ''}
                  onChange={e => setEditingGuest(prev => ({
                    ...prev,
                    contactNumber: e.target.value
                  }))}
                  required
                />
              </EditFormGroup>
              <ModalButtons>
                <ActionButton
                  type="button"
                  onClick={() => setEditingGuest(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  type="submit"
                  $variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </ActionButton>
              </ModalButtons>
            </EditForm>
          </EditModal>
        </>
      )}

      {deletingGuest && (
        <>
          <Overlay onClick={() => !isSubmitting && setDeletingGuest(null)} />
          <ConfirmationModal>
            <h3>Delete Guest</h3>
            <p>
              Are you sure you want to delete {deletingGuest.name}? 
              This action cannot be undone.
            </p>
            {error && <Message $type="error">{error}</Message>}
            <ModalButtons>
              <ActionButton
                type="button"
                onClick={() => setDeletingGuest(null)}
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
            </ModalButtons>
          </ConfirmationModal>
        </>
      )}
    </PageContainer>
  );
};

export default ManageGuests;