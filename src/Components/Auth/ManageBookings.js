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

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5217/api/Bookings');
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleEditBooking = async (bookingId) => {
    const booking = bookings.find(b => b.BookingID === bookingId);
    if (!booking) {
      alert('Booking not found!');
      return;
    }
    const updatedStatus = prompt('Enter new status (Confirmed, Cancelled, Pending):', booking.Status);
    if (updatedStatus) {
      try {
        await axios.put(`http://localhost:5217/api/Bookings/${bookingId}`, {
          ...booking,
          Status: updatedStatus,
        });
        const updatedBookings = bookings.map(b =>
          b.BookingID === bookingId ? { ...b, Status: updatedStatus } : b
        );
        setBookings(updatedBookings);
      } catch (err) {
        alert('Failed to update booking. Please try again.');
      }
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5217/api/Bookings/${bookingId}`);
      setBookings(prevBookings => prevBookings.filter(booking => booking.BookingID !== bookingId));
    } catch (err) {
      alert('Failed to delete booking. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <Container>
      <Title>Manage Bookings</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Guest</TableHeader>
            <TableHeader>Room</TableHeader>
            <TableHeader>Check-in</TableHeader>
            <TableHeader>Check-out</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <TableRow key={booking.BookingID}>
              <TableCell>{booking.BookingID}</TableCell>
              <TableCell>{booking.User?.Name || 'N/A'}</TableCell>
              <TableCell>{booking.Room?.RoomID || 'N/A'}</TableCell>
              <TableCell>{new Date(booking.CheckInDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(booking.CheckOutDate).toLocaleDateString()}</TableCell>
              <TableCell>{booking.Status}</TableCell>
              <TableCell>
                <ActionButton variant="edit" onClick={() => handleEditBooking(booking.BookingID)}>
                  Edit
                </ActionButton>
                <ActionButton variant="delete" onClick={() => handleDeleteBooking(booking.BookingID)}>
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

export default ManageBookings;