import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { AiFillMacCommand } from 'react-icons/ai';

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  gap: 15px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

export const ActionButton = styled.button`
  padding: 8px 16px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: ${(props) =>
    props.$variant === "edit" ? "#007bff" : "#dc3545"};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.$variant === "edit" ? "#0056b3" : "#c82333"};
    transform: translateY(-1px);
  }
`;

const EditHotelModal = ({ hotel, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: hotel.name || '',
    location: hotel.location || '',
    amenities: hotel.amenities || [],
    managerID: hotel.managerID || null
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Hotel name is required';
    } else if (formData.name.length > 200) {
      newErrors.name = 'Name must not exceed 200 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.length > 500) {
      newErrors.location = 'Location must not exceed 500 characters';
    }

    if (!formData.managerID) {
      newErrors.managerID = 'Manager ID is required';
    }

    if (formData.amenities?.length > 200) {
      newErrors.amenities = 'Amenities must not exceed 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave({
      ...hotel,
      name: formData.name.trim(),
      location: formData.location.trim(),
      managerID: parseInt(formData.managerID, 10),
      amenities: formData.amenities.trim()
    });
  };

  return (
    <>
      <Overlay onClick={onCancel} />
      <Modal>
        <h3>Edit Hotel</h3>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              name: e.target.value 
            }))}
            placeholder="Hotel Name"
            required
          />
          <Input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              location: e.target.value 
            }))}
            placeholder="Location"
            required
          />
          <Input
            type="text"
            value={formData.amenities}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              amenities: e.target.value 
            }))}
            placeholder="Amenities"
            required
          />
          <Input
            type="text"
            value={formData.managerID }
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              managerID: e.target.value 
            }))}
            placeholder="Manager ID"
            required
          />
          <ButtonGroup>
            <ActionButton 
              type="button" 
              $variant="delete" 
              onClick={onCancel}
            >
              Cancel
            </ActionButton>
            <ActionButton 
              type="submit" 
              $variant="edit"
            >
              Save Changes
            </ActionButton>
          </ButtonGroup>
        </Form>
      </Modal>
    </>
  );
};

 // Update PropTypes at the bottom
 EditHotelModal.propTypes = {
    hotel: PropTypes.shape({
      hotelID: PropTypes.number.isRequired,
      name: PropTypes.string,
      location: PropTypes.string,
      amenities: PropTypes.string,
      managerID: PropTypes.number
    }).isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

export default EditHotelModal;