import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaEdit, FaTrash } from 'react-icons/fa';
const RoomList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;
const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
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
const RoomCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const RoomInfo = styled.div`
  flex: 1;
`;

const RoomType = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
`;

const RoomDetails = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const IconButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.$variant === 'edit' ? '#3498db' : '#e74c3c'};
  color: white;

  &:hover {
    transform: translateY(-2px);
    background-color: ${props => props.$variant === 'edit' ? '#2980b9' : '#c0392b'};
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const FormWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
`;

const Button = styled.button`
  padding: 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  padding: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;
const PageHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;

  h2 {
    font-size: 2rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  p {
    color: #7f8c8d;
    font-size: 1.1rem;
  }
`;

const ResponsiveFormWrapper = styled(FormWrapper)`
  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0 1rem;
  }
`;

const ResponsiveGrid = styled(RoomList)`
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${props => 
    props.$available ? '#27ae60' : '#e74c3c'};
  color: white;
`;

const PriceTag = styled.span`
  font-weight: 600;
  color: #2980b9;
  font-size: 1.1rem;
`;

const UpdateRoom = () => {
 const { hotelID } = useParams();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingRoom, setEditingRoom] = useState(null);
    const [editForm, setEditForm] = useState({
      type: '',
      price: '',
      availability: true,
      features: ''
    });
  
    useEffect(() => {
      const fetchRooms = async () => {
        try {
          const response = await axios.get(`https://localhost:7125/api/Rooms/${hotelID}/rooms`);
          setRooms(response.data);
          setError('');
        } catch (err) {
          setError('Failed to fetch rooms');
          console.error('Error:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchRooms();
    }, [hotelID]);
  
    const handleEdit = (room) => {
        if (!room.roomID) {
            console.error('Invalid room data:', room);
            setError('Invalid room data');
            return;
          }
        setEditingRoom(room);
        setEditForm({
          type: room.type || '',
          price: room.price || '',
          availability: room.availability,
          features: room.features || ''
        });
      };
    
      const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        if (!editingRoom?.roomID) {
          setError('RoomID is missing');
          console.error('RoomID is missing for editing:', editingRoom);
          return;
        }
        
        try {
          // Validate form data
          if (!editForm.type || editForm.type.length > 50) {
            setError('Room type is required and must not exceed 50 characters');
            return;
          }
    
          if (!editForm.price || isNaN(editForm.price) || editForm.price <= 0) {
            setError('Please enter a valid price');
            return;
          }
    
          if (editForm.features && editForm.features.length > 500) {
            setError('Features must not exceed 500 characters');
            return;
          }
    
          const patchData = {
            type: editForm.type.trim(),
            price: parseFloat(editForm.price),
            availability: editForm.availability,
            features: editForm.features.trim()
          };
    
          const response = await axios.patch(
            `https://localhost:7125/api/Rooms/${editingRoom.roomID}`,
            patchData,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
    
          if (response.data) {
            // Update local state
            setRooms(prevRooms =>
              prevRooms.map(room =>
                room.roomID === editingRoom.roomID
                  ? { ...room, ...patchData }
                  : room
              )
            );
            setEditingRoom(null);
            setError('');
            alert('Room updated successfully');
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to update room');
          console.error('Update error:', err);
        }
      };
  
    const handleDelete = async (roomId) => {
      if (!window.confirm('Are you sure you want to delete this room?')) {
        return;
      }
  
      try {
        const response = await axios.delete(`https://localhost:7125/api/Rooms/${roomId}`);
        if (response.status === 200) {
          setRooms(prevRooms => prevRooms.filter(room => room.roomID !== roomId));
          alert('Room deleted successfully');
        }
      } catch (err) {
        alert('Failed to delete room');
        console.error('Delete error:', err);
      }
    };
  
    if (loading) return <Container>Loading...</Container>;
  
    return (
      <Container>
        <FormWrapper>
          <h2>Manage Rooms</h2>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <RoomList>
            {rooms.length === 0 ? (
              <p>No rooms found</p>
            ) : (
              rooms.map(room => (
                <RoomCard key={room.roomID}>
                  <RoomInfo>
                    <RoomType>{room.type}</RoomType>
                    <RoomDetails>
                      Price: ${room.price} | 
                      Status: {room.availability ? 'Available' : 'Not Available'} |
                      Features: {room.features || 'None'}
                    </RoomDetails>
                  </RoomInfo>
                  <ActionButtons>
                    <IconButton 
                      $variant="edit" 
                      onClick={() => handleEdit(room)}
                      title="Edit Room"
                    >
                       <FaEdit />
                    </IconButton>
                    <IconButton 
                      $variant="delete" 
                      onClick={() => handleDelete(room.roomID)}
                      title="Delete Room"
                    >
                       <FaTrash />
                    </IconButton>
                  </ActionButtons>
                </RoomCard>
              ))
            )}
          </RoomList>
  
          <Button 
            style={{ marginTop: '2rem' }}
            onClick={() => navigate(`/hotel-rooms/${hotelID}/add`)}
          >
            Add New Room
          </Button>
        </FormWrapper>
        {editingRoom && (
        <>
          <Overlay onClick={() => setEditingRoom(null)} />
          <Modal>
            <h3>Edit Room</h3>
            <Form onSubmit={handleUpdate}>
              <FormGroup>
                <Label>Room Type</Label>
                <Input
                  type="text"
                  value={editForm.type}
                  onChange={e => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                  maxLength={50}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editForm.price}
                  onChange={e => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Availability</Label>
                <Select
                  value={editForm.availability}
                  onChange={e => setEditForm(prev => ({ 
                    ...prev, 
                    availability: e.target.value === 'true' 
                  }))}
                >
                  <option value={true}>Available</option>
                  <option value={false}>Not Available</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Features</Label>
                <Textarea
                  value={editForm.features}
                  onChange={e => setEditForm(prev => ({ ...prev, features: e.target.value }))}
                  maxLength={500}
                  placeholder="Enter room features..."
                />
              </FormGroup>

              <ActionButtons style={{ marginTop: '1rem' }}>
                <Button type="button" onClick={() => setEditingRoom(null)}>
                  Cancel
                </Button>
                <Button type="submit" $variant="edit">
                  Update Room
                </Button>
              </ActionButtons>
            </Form>
          </Modal>
        </>
      )}
      </Container>
    );
  };
  
  export default UpdateRoom;