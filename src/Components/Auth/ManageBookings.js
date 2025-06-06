import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
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
  Form,
  FormGroup,
  Input,
  Select,
  Modal,
  Overlay,
  Message,
  LoadingSpinner
} from '../Styles/SharedStyles';

const ManageBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingBooking, setEditingBooking] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editForm, setEditForm] = useState({
    checkInDate: '',
    checkOutDate: '',
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
    setEditForm({
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      status: booking.status
    });
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
        setSuccessMessage('Booking updated successfully');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update booking. Please try again.');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this booking? This action cannot be undone.');

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await axios.delete(`https://localhost:7125/api/Bookings/${bookingId}`);
      if (response.status === 200) {
        setBookings(prevBookings => prevBookings.filter(booking => booking.bookingID !== bookingId));
        setSuccessMessage('Booking deleted successfully');
      }
    } catch (err) {
      if (err.response?.status === 409 || err.response?.status === 500) {
        alert('This booking cannot be deleted because it has related records (payments or reviews). Please remove related records first.');
      } else if (err.response?.status === 404) {
        alert('Booking not found. It may have been already deleted.');
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

  return (
    <PageContainer>
      <HeaderSection>
        <ButtonGroup>
          <ActionButton onClick={() => navigate('/admin-dashboard')}>
            <FiArrowLeft /> Back
          </ActionButton>
        </ButtonGroup>
        <Title>Manage Bookings</Title>
      </HeaderSection>

      <ContentCard>
        {error && <Message $type="error">{error}</Message>}
        {successMessage && <Message $type="success">{successMessage}</Message>}

        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Guest</Th>
              <Th>Room</Th>
              <Th>Check-in</Th>
              <Th>Check-out</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <Tr key={booking.bookingID}>
                <Td>{booking.bookingID}</Td>
                <Td>{booking.user?.name || 'N/A'}</Td>
                <Td>{booking.room?.roomID || 'N/A'}</Td>
                <Td>{new Date(booking.checkInDate).toLocaleDateString()}</Td>
                <Td>{new Date(booking.checkOutDate).toLocaleDateString()}</Td>
                <Td>{booking.status}</Td>
                <Td>
                  <ButtonGroup>
                    <ActionButton 
                      $variant="primary"
                      onClick={() => handleEditBooking(booking.bookingID)}
                    >
                      <FiEdit2 />
                    </ActionButton>
                    <ActionButton 
                      $variant="danger"
                      onClick={() => handleDeleteBooking(booking.bookingID)}
                    >
                      <FiTrash2 />
                    </ActionButton>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </ContentCard>

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

              <ButtonGroup>
                <ActionButton type="submit" $variant="primary">
                  Save Changes
                </ActionButton>
                <ActionButton 
                  type="button"
                  onClick={() => setEditingBooking(null)}
                >
                  Cancel
                </ActionButton>
              </ButtonGroup>
            </Form>
          </Modal>
        </>
      )}
    </PageContainer>
  );
};

export default ManageBookings;