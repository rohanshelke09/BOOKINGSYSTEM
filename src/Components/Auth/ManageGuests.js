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
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  padding: 12px 15px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  &:hover {
    background-color: #f5f5f5;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
  vertical-align: middle;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: ${props => (props.variant === 'edit' ? '#007bff' : '#dc3545')};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => (props.variant === 'edit' ? '#0056b3' : '#c82333')};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => (props.variant === 'edit' ? 'rgba(0,123,255,0.25)' : 'rgba(220,53,69,0.25)')};
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  text-align: center;
  margin: 20px 0;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dc3545;
`;

const LoadingMessage = styled.p`
  text-align: center;
  margin: 20px 0;
  color: #666;
`;

const ManageGuests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:7125/api/User/by-role/guest');
      console.log('Fetched guests:', response.data);
      setGuests(response.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch guests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGuest = async (guest) => {
    const updatedName = prompt('Enter new name:', guest.name);
    const updatedEmail = prompt('Enter new email:', guest.email);

    if (!updatedName || !updatedEmail) {
      alert('Both name and email are required');
      return;
    }

    if (!updatedEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const updatedGuest = {
        userID: guest.userID,
        name: updatedName,
        email: updatedEmail,
        password: guest.password,
        role: guest.role
      };

      const response = await axios.put(
        `https://localhost:7125/api/User/${guest.userID}`,
        updatedGuest
      );

      if (response.data) {
        setGuests(prevGuests =>
          prevGuests.map(g =>
            g.userID === guest.userID
              ? { ...g, name: updatedName, email: updatedEmail }
              : g
          )
        );
        await fetchGuests(); // Refresh the list
        alert('Guest updated successfully!');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update guest information.');
    }
  };

  const handleDeleteGuest = async (userID) => {
    if (!window.confirm('Are you sure you want to delete this guest?')) {
      return;
    }

    try {
      await axios.delete(`https://localhost:7125/api/User/${userID}`);
      setGuests(prevGuests => prevGuests.filter(g => g.userID !== userID));
      await fetchGuests(); // Refresh the list
      alert('Guest deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete guest.');
    }
  };

  if (loading) return <LoadingMessage>Loading guests...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      <Title>Manage Guests</Title>
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
          {guests.map(guest => (
            <TableRow key={guest.userID}>
              <TableCell>{guest.userID}</TableCell>
              <TableCell>{guest.name}</TableCell>
              <TableCell>{guest.email}</TableCell>
              <TableCell>
                <ActionButton 
                  variant="edit" 
                  onClick={() => handleEditGuest(guest)}
                >
                  Edit
                </ActionButton>
                <ActionButton 
                  variant="delete" 
                  onClick={() => handleDeleteGuest(guest.userID)}
                >
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

export default ManageGuests;