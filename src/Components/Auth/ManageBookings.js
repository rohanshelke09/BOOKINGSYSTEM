import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
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
  background-color: ${props => (props.$variant === 'edit' ? '#007bff' : '#dc3545')};

  &:hover {
    background-color: ${props => (props.$variant === 'edit' ? '#0056b3' : '#c82333')};
  }
`;

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({
    checkInDate: null,
    checkOutDate: null,
    status: ''
  });

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://localhost:7125/api/Bookings');
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);
  const handleEditBooking = (bookingId) => {
    const booking = bookings.find(b => b.bookingID === bookingId);
    if (!booking) {
      alert('Booking not found!');
      return;
    }
    setEditingBooking(booking);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    const checkIn = new Date(editForm.checkInDate);
    const checkOut = new Date(editForm.checkOutDate);
    
    if (checkIn >= checkOut) {
      alert('Check-out date must be after check-in date');
      return;
    }

    try {
      const patchData = {
        checkInDate: editForm.checkInDate,
        checkOutDate: editForm.checkOutDate,
        status: editForm.status
      };

      const response = await axios.patch(
        `https://localhost:7125/api/Bookings/${editingBooking.bookingID}`,
        patchData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setBookings(prevBookings =>
          prevBookings.map(b =>
            b.bookingID === editingBooking.bookingID
              ? { ...b, ...patchData }
              : b
          )
        );
        setEditingBooking(null);
        alert('Booking updated successfully');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update booking. Please try again.');
    }
  };
  

  const handleDeleteBooking = async (bookingId) => {
    // Add confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this booking? This action cannot be undone.');
    
    if (!isConfirmed) {
      return;
    }
  
    try {
      const response = await axios.delete(`https://localhost:7125/api/Bookings/${bookingId}`);
      if (response.status === 200) {
        setBookings(prevBookings => prevBookings.filter(booking => booking.bookingID !== bookingId));
        alert('Booking deleted successfully');
      }
    } catch (err) {
      // Handle specific error cases
      if (err.response?.status === 409 || err.response?.status === 500) {
        alert('This booking cannot be deleted because it has related records (payments or reviews). Please remove related records first.');
      } else if (err.response?.status === 404) {
        alert('Booking not found. It may have been already deleted.');
        // Refresh the bookings list to ensure UI is in sync
        setBookings(prevBookings => prevBookings.filter(booking => booking.bookingID !== bookingId));
      } else {
        alert('Failed to delete booking. Please try again later.');
      }
      console.error('Delete error details:', {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
        bookingId
      });
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
            <TableRow key={booking.bookingID}>
              <TableCell>{booking.bookingID}</TableCell>
              <TableCell>{booking.user?.name || 'N/A'}</TableCell>
              <TableCell>{booking.room?.roomID || 'N/A'}</TableCell>
              <TableCell>{new Date(booking.checkInDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(booking.checkOutDate).toLocaleDateString()}</TableCell>
              <TableCell>{booking.status}</TableCell>
              <TableCell>
                <ActionButton $variant="edit" onClick={() => handleEditBooking(booking.bookingID)}>
                  Edit
                </ActionButton>
                <ActionButton $variant="delete" onClick={() => handleDeleteBooking(booking.bookingID)}>
                  Delete
                </ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      {editingBooking && (
        <>
          <Overlay onClick={() => setEditingBooking(null)} />
          <Modal>
            <h2>Edit Booking</h2>
            <Form onSubmit={handleSaveEdit}>
              <FormGroup>
                <label>Check-in Date</label>
                <Input
                  type="date"
                  value={editForm.checkInDate}
                  onChange={e => setEditForm(prev => ({ 
                    ...prev, 
                    checkInDate: e.target.value 
                  }))}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Check-out Date</label>
                <Input
                  type="date"
                  value={editForm.checkOutDate}
                  min={editForm.checkInDate}
                  onChange={e => setEditForm(prev => ({ 
                    ...prev, 
                    checkOutDate: e.target.value 
                  }))}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Status</label>
                <Select
                  value={editForm.status}
                  onChange={e => setEditForm(prev => ({ 
                    ...prev, 
                    status: e.target.value 
                  }))}
                  required
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </FormGroup>

              <div>
                <ActionButton type="submit" $variant="edit">
                  Save Changes
                </ActionButton>
                <ActionButton 
                  type="button" 
                  $variant="delete" 
                  onClick={() => setEditingBooking(null)}
                >
                  Cancel
                </ActionButton>
              </div>
            </Form>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default ManageBookings;