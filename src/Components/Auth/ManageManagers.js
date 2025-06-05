import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  text-align: left;
  font-weight: 600;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: white;
  background-color: ${props => (props.variant === 'edit' ? '#007bff' : '#dc3545')};

  &:hover {
    background-color: ${props => (props.variant === 'edit' ? '#0056b3' : '#c82333')};
  }
`;

const ManageManagers = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchManagers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5217/api/User/by-role/manager');
        setManagers(response.data);
      } catch (err) {
        setError('Failed to fetch managers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  const handleEditManager = (managerId) => {
    const manager = managers.find(m => m.id === managerId);
    const updatedName = prompt('Enter new name:', manager.name);
    if (updatedName) {
      const updatedManagers = managers.map(m =>
        m.id === managerId ? { ...m, name: updatedName } : m
      );
      setManagers(updatedManagers);
    }
  };

  const handleDeleteManager = async (managerId) => {
    try {
      await axios.delete(`http://localhost:5217/api/User/by-role/manager/${managerId}`);
      setManagers(prevManagers => prevManagers.filter(manager => manager.id !== managerId));
    } catch (err) {
      setError('Failed to delete manager. Please try again later.');
    }
  };

  if (loading) {
    return <p>Loading managers...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <Container>
      <Title>Manage Managers</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {managers.map(manager => (
            <TableRow key={manager.id}>
              <TableCell>{manager.id}</TableCell>
              <TableCell>{manager.name}</TableCell>
              <TableCell>{manager.email}</TableCell>
              <TableCell>
                <ActionButton variant="edit" onClick={() => handleEditManager(manager.id)}>
                  Edit
                </ActionButton>
                <ActionButton variant="delete" onClick={() => handleDeleteManager(manager.id)}>
                  Delete
                </ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManageManagers;