import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUserPlus, FiTrash2, FiSearch } from 'react-icons/fi';
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
} from '../Styles/ManagePageStyles'
import EditManagerModal from '../EditManagerModal';

export const SearchBar = styled.div`
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

  button {
    padding: 10px 20px;
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
  text-align: center;

  h3 {
    color: #1f2937;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  p {
    color: #4b5563;
    margin-bottom: 1.5rem;
  }
`;

const ModalButtons = styled(ButtonGroup)`
  justify-content: center;
  gap: 1rem;

  button {
    min-width: 100px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ManageManagers = () => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAddingManager, setIsAddingManager] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingManager, setDeletingManager] = useState(null);

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:7125/api/User/by-role/manager');
      setManagers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch managers. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddManager = async (newManager) => {
    try {
      const response = await axios.post(
        'https://localhost:7125/api/User',
        { ...newManager, role: 'manager' }
      );

      if (response.status === 201) {
        setSuccessMessage('Manager added successfully!');
        setIsAddingManager(false);
        await fetchManagers();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add manager';
      window.alert(errorMessage);
    }
  };

  const handleDeleteClick = (manager) => {
    setDeletingManager(manager);
  };

  const confirmDelete = async () => {
    try {
      // Set loading state
      setLoading(true);
      setError(null);

      // Make the DELETE request
      await axios.delete(`https://localhost:7125/api/User/${deletingManager.userID}`);

      // Update the local state
      setManagers(prevManagers => 
        prevManagers.filter(manager => manager.userID !== deletingManager.userID)
      );
      
      // Show success message
      setSuccessMessage(`Manager ${deletingManager.name} was successfully deleted`);
      
      // Clear the deleting state
      setDeletingManager(null);

    } catch (err) {
      // Handle specific error cases
      if (err.response) {
        switch (err.response.status) {
          case 404:
            setError(`Manager with ID ${deletingManager.userID} not found`);
            // Remove from local state if not found on server
            setManagers(prevManagers => 
              prevManagers.filter(manager => manager.userID !== deletingManager.userID)
            );
            break;
          case 403:
            setError('You do not have permission to delete this manager');
            break;
          default:
            setError(err.response.data?.message || 'Failed to delete manager. Please try again.');
        }
      } else {
        setError('Network error occurred. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
      // Clear deleting state after a short delay to allow animation
      setTimeout(() => {
        setDeletingManager(null);
      }, 500);
    }
  };

  return (
    <PageContainer>
      <HeaderSection>
        <ButtonGroup>
          <ActionButton onClick={() => navigate('/admin-dashboard')}>
            <FiArrowLeft /> Back to Dashboard
          </ActionButton>
        </ButtonGroup>
        <Title>Manage Managers</Title>
        <ButtonGroup>
          <ActionButton $primary onClick={() => setIsAddingManager(true)}>
            <FiUserPlus /> Add Manager
          </ActionButton>
        </ButtonGroup>
      </HeaderSection>

      <ContentCard>
       
        {error && <Message $type="error">{error}</Message>}
        {successMessage && <Message $type="success">{successMessage}</Message>}

        {loading ? (
          <LoadingSpinner>Loading managers...</LoadingSpinner>
        ) : (
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
              {managers.map((manager) => (
                <Tr key={manager.userID}>
                  <Td>{manager.userID}</Td>
                  <Td>{manager.name}</Td>
                  <Td>{manager.email}</Td>
                  <Td>{manager.contactNumber}</Td>
                  <Td>
                    <ActionButton $variant="danger" onClick={() => handleDeleteClick(manager)}>
                      <FiTrash2 /> Delete
                    </ActionButton>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </ContentCard>

      {isAddingManager && (
        <EditManagerModal
          isAdd={true}
          manager={null}
          onSave={handleAddManager}
          onCancel={() => setIsAddingManager(false)}
        />
      )}

      {deletingManager && (
        <>
          <Overlay onClick={() => !loading && setDeletingManager(null)} />
          <ConfirmationModal>
            <h3>Delete Manager</h3>
            <p>
              Are you sure you want to delete manager {deletingManager.name}? 
              This action cannot be undone.
            </p>
            <ModalButtons>
              <ActionButton 
                onClick={() => setDeletingManager(null)} 
                disabled={loading}
              >
                Cancel
              </ActionButton>
              <ActionButton 
                $variant="danger" 
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </ActionButton>
            </ModalButtons>
          </ConfirmationModal>
        </>
      )}
    </PageContainer>
  );
};

export default ManageManagers;