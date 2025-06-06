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
} from '../Styles/SharedStyles'
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

const ManageManagers = () => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAddingManager, setIsAddingManager] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDeleteClick = async (userID) => {
    if (!window.confirm('Are you sure you want to delete this manager? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await axios.delete(
        `https://localhost:7125/api/User/${userID}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 204 || response.status === 200) {
        setSuccessMessage('Manager deleted successfully!');
        setManagers(prevManagers => prevManagers.filter(manager => manager.userID !== userID));
      }
    } catch (err) {
      console.error('Delete error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data || 
                          'Failed to delete manager. Please try again.';
      window.alert(errorMessage);
      setError(errorMessage);
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
          <ActionButton $variant="primary" onClick={() => setIsAddingManager(true)}>
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
                    <ActionButton $variant="danger" onClick={() => handleDeleteClick(manager.userID)}>
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
    </PageContainer>
  );
};

export default ManageManagers;