import React, { useState } from 'react';
import styled from 'styled-components';

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
    props.variant === "edit" ? "#007bff" : "#dc3545"};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.variant === "edit" ? "#0056b3" : "#c82333"};
    transform: translateY(-1px);
  }
`;
const EditHotelModal = ({ hotel, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: hotel.name,
    location: hotel.location
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...hotel,
      ...formData
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
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Hotel Name"
            required
          />
          <Input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Location"
            required
          />
          <ButtonGroup>
            <ActionButton type="button" variant="delete" onClick={onCancel}>
              Cancel
            </ActionButton>
            <ActionButton type="submit" variant="edit">
              Save Changes
            </ActionButton>
          </ButtonGroup>
        </Form>
      </Modal>
    </>
  );
};

export default EditHotelModal;