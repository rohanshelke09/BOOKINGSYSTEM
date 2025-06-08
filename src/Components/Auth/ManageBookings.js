import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
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
  Form,
  FormGroup,
  Input,
  Select,
  Modal,
  Overlay,
  Message,
  LoadingSpinner
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

const EditModal = styled(Modal)`
  padding: 2rem;
  
  h2 {
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #e5e7eb;
  }
`;

const EditForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const EditFormGroup = styled(FormGroup)`
  label {
    display: block;
    font-weight: 500;
    color: #4b5563;
    margin-bottom: 0.5rem;
  }

  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.2s;

    &:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
      outline: none;
    }
  }
`;

const ModalButtons = styled(ButtonGroup)`
  margin-top: 1.5rem;
  justify-content: flex-end;
  gap: 1rem;

  button {
    min-width: 120px;
  }
`;

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
  const [searchTerm, setSearchTerm] = useState('');

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
      setError('Booking not found!');
      return;
    }
    // Format dates to YYYY-MM-DD for input fields
    const formattedCheckIn = new Date(booking.checkInDate).toISOString().split('T')[0];
    const formattedCheckOut = new Date(booking.checkOutDate).toISOString().split('T')[0];
    
    setEditingBooking(booking);
    setEditForm({
      checkInDate: formattedCheckIn,
      checkOutDate: formattedCheckOut,
      status: booking.status
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const checkIn = new Date(editForm.checkInDate);
      const checkOut = new Date(editForm.checkOutDate);

      if (checkIn >= checkOut) {
        setError('Check-out date must be after check-in date');
        return;
      }

      const updatedBooking = {
        ...editingBooking,
        checkInDate: editForm.checkInDate,
        checkOutDate: editForm.checkOutDate,
        status: editForm.status
      };

      const response = await axios.put(
        `https://localhost:7125/api/Bookings/${editingBooking.bookingID}`,
        updatedBooking
      );

      if (response.data) {
        setBookings(prevBookings =>
          prevBookings.map(b =>
            b.bookingID === editingBooking.bookingID
              ? { ...b, ...updatedBooking }
              : b
          )
        );
        setEditingBooking(null);
        setSuccessMessage('Booking updated successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking. Please try again.');
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

  const filteredBookings = bookings.filter(booking => 
    booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookingID.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>Loading bookings...</LoadingSpinner>
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
        <Title>Manage Bookings</Title>
        <ButtonGroup>
          <div style={{ width: '120px' }} />
        </ButtonGroup>
      </HeaderSection>

      <ContentCard>
        <SearchBar>
          <input
            type="text"
            placeholder="Search bookings by guest name, status or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ActionButton>
            <FiSearch /> Search
          </ActionButton>
        </SearchBar>

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
            {filteredBookings.map(booking => (
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
                      onClick={() => handleEditBooking(booking.bookingID)}
                    >
                      <FiEdit2 /> Edit
                    </ActionButton>
                    <ActionButton 
                      $variant="danger"
                      onClick={() => handleDeleteBooking(booking.bookingID)}
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

      {editingBooking && (
        <>
          <Overlay onClick={() => {
            setEditingBooking(null);
            setError('');
            setSuccessMessage('');
          }} />
          <EditModal onClick={(e) => e.stopPropagation()}>
            <h2>Edit Booking Details</h2>
            {error && <Message $type="error">{error}</Message>}
            <EditForm onSubmit={handleSaveEdit}>
              <EditFormGroup>
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
              </EditFormGroup>

              <EditFormGroup>
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
              </EditFormGroup>

              <EditFormGroup>
                <label>Booking Status</label>
                <Select
                  value={editForm.status}
                  onChange={e => setEditForm(prev => ({ 
                    ...prev, 
                    status: e.target.value 
                  }))}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </EditFormGroup>

              <ModalButtons>
                <ActionButton 
                  type="button"
                  onClick={() => {
                    setEditingBooking(null);
                    setError('');
                    setSuccessMessage('');
                  }}
                >
                  Cancel
                </ActionButton>
                <ActionButton type="submit" $primary>
                  Save Changes
                </ActionButton>
              </ModalButtons>
            </EditForm>
          </EditModal>
        </>
      )}
    </PageContainer>
  );
};

export default ManageBookings;