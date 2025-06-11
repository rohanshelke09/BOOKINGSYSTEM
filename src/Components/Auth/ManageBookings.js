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
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 1001;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translate(-50%, -60%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%);
      opacity: 1;
    }
  }

  h2 {
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    text-align: center;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 1rem;
  }
`;

const StyledActionButton = styled(ActionButton)`
  width: 100%;
  padding: 0.75rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &.cancel {
    background-color: #f3f4f6;
    color: #4b5563;
    &:hover {
      background-color: #e5e7eb;
    }
  }

  &.save {
    background-color: #4f46e5;
    color: white;
    &:hover {
      background-color: #4338ca;
    }
  }
`;

const EditForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const EditFormGroup = styled(FormGroup)`
  label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
    font-size: 1rem;
  }

  input, select {
    width: 100%;
    padding: 0.875rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.2s ease;
    background-color: #f9fafb;

    &:hover {
      border-color: #d1d5db;
    }

    &:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
      outline: none;
      background-color: white;
    }
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1.25rem;
    padding-right: 2.5rem;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
`;

const ModalButtons = styled(ButtonGroup)`
  margin-top: 2rem;
  justify-content: flex-end;
  gap: 1rem;

  button {
    min-width: 130px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    transition: all 0.2s ease;

    &:first-child {
      background-color: #f3f4f6;
      color: #4b5563;
      
      &:hover {
        background-color: #e5e7eb;
      }
    }

    &:last-child {
      background-color: #4f46e5;
      color: white;
      
      &:hover {
        background-color: #4338ca;
      }
    }
  }
`;

const ConfirmationModalButtons = styled(ButtonGroup)`
  justify-content: center;
  gap: 1rem;

  button {
    min-width: 120px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    transition: all 0.2s ease;

    &:first-child {
      background-color: #f3f4f6;
      color: #4b5563;
      
      &:hover {
        background-color: #e5e7eb;
      }
    }

    &:last-child {
      background-color: #ef4444;
      color: white;
      
      &:hover {
        background-color: #dc2626;
      }
    }
  }
`;

const Message = styled.div`
  padding: 1rem 1.5rem;
  margin: 1rem 0;
  border-radius: 0.5rem;
  font-weight: 500;
  text-align: center;
  font-size: 1rem;
  line-height: 1.5;
  background-color: ${props => props.$type === 'error' ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.$type === 'error' ? '#dc2626' : '#16a34a'};
  border: 1px solid ${props => props.$type === 'error' ? '#fecaca' : '#bbf7d0'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  animation: slideIn 0.3s ease-out;
  @keyframes slideIn {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
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

  .warning-text {
    color: #dc2626;
    font-size: 0.875rem;
    margin-top: 0.5rem;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingBooking, setDeletingBooking] = useState(null);

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
    setIsSubmitting(true);

    try {
      const checkIn = new Date(editForm.checkInDate);
      const checkOut = new Date(editForm.checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        setError('Check-in date cannot be in the past');
        setIsSubmitting(false);
        return;
      }

      if (checkIn >= checkOut) {
        setError('Check-out date must be after check-in date');
        setIsSubmitting(false);
        return;
      }

      const updatedBooking = {
        checkInDate: editForm.checkInDate,
        checkOutDate: editForm.checkOutDate,
        status: editForm.status
      };

      const response = await axios.patch(
        `https://localhost:7125/api/Bookings/${editingBooking.bookingID}`,
        updatedBooking,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 204) {
        setBookings(prevBookings =>
          prevBookings.map(b =>
            b.bookingID === editingBooking.bookingID
              ? { ...b, ...updatedBooking }
              : b
          )
        );
        setSuccessMessage('Booking updated successfully');
        setEditingBooking(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (booking) => {
    setDeletingBooking(booking);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage('');

      // Check if booking exists and has payment status
      const bookingCheck = await axios.get(
        `https://localhost:7125/api/Bookings/${deletingBooking.bookingID}`
      );

      if (bookingCheck.data.paymentStatus === 'Paid') {
        setError(`Cannot delete booking #${deletingBooking.bookingID} as payment has been processed.`);
        return;
      }

      const response = await axios.delete(
        `https://localhost:7125/api/Bookings/${deletingBooking.bookingID}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 204) {
        // Remove booking from UI
        setBookings(prevBookings => 
          prevBookings.filter(booking => booking.bookingID !== deletingBooking.bookingID)
        );
        setSuccessMessage(`Booking #${deletingBooking.bookingID} was successfully deleted`);
        
        // Close modal after successful deletion
        setTimeout(() => {
          setDeletingBooking(null);
        }, 1500); // Give user time to see success message
      }
    } catch (err) {
      console.error('Delete error:', err);
      
      if (err.response) {
        switch (err.response.status) {
          case 500:
            setError('Server error: The booking could not be deleted at this time. Please try again later.');
            setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
            break;
          case 400:
            setError('This booking cannot be deleted as it has associated records.');
            break;
          case 404:
            setError('Booking not found.');
            setBookings(prevBookings => 
              prevBookings.filter(booking => booking.bookingID !== deletingBooking.bookingID)
            );
            break;
          default:
            setError('An error occurred while deleting the booking. Please try again.');
        }
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
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
                    {/* <ActionButton 
                      $variant="danger"
                      onClick={() => handleDeleteClick(booking)}
                    >
                      <FiTrash2 /> Delete
                    </ActionButton> */}
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
            if (!isSubmitting) {
              setEditingBooking(null);
              setError('');
              setSuccessMessage('');
            }
          }} />
          <EditModal onClick={(e) => e.stopPropagation()}>
            <h2>Edit Booking #{editingBooking.bookingID}</h2>
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
                  min={new Date().toISOString().split('T')[0]}
                  required
                  disabled={isSubmitting}
                />
              </EditFormGroup>

              <EditFormGroup>
                <label>Check-out Date</label>
                <Input
                  type="date"
                  value={editForm.checkOutDate}
                  min={editForm.checkInDate || new Date().toISOString().split('T')[0]}
                  onChange={e => setEditForm(prev => ({ 
                    ...prev, 
                    checkOutDate: e.target.value 
                  }))}
                  required
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  <option value="">Select Status</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </EditFormGroup>

              <ModalButtons>
                <StyledActionButton 
                  type="button"
                  className="cancel"
                  onClick={() => {
                    if (!isSubmitting) {
                      setEditingBooking(null);
                      setError('');
                      setSuccessMessage('');
                    }
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </StyledActionButton>
                <StyledActionButton 
                  type="submit" 
                  className="save"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </StyledActionButton>
              </ModalButtons>
            </EditForm>
          </EditModal>
        </>
      )}

      {deletingBooking && (
        <>
          <Overlay onClick={() => !loading && setDeletingBooking(null)} />
          <ConfirmationModal>
            <h3>Delete Booking</h3>
            <p>
              Are you sure you want to delete booking #{deletingBooking.bookingID}?
              This action cannot be undone.
            </p>
            <ConfirmationModalButtons>
              <ActionButton 
                onClick={() => setDeletingBooking(null)} 
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
            </ConfirmationModalButtons>
          </ConfirmationModal>
        </>
      )}
    </PageContainer>
  );
};

export default ManageBookings;