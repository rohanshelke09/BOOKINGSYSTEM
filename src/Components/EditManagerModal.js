import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: 600;
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

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.$primary ? '#007bff' : '#6c757d'};
  color: white;

  &:hover {
    background-color: ${props => props.$primary ? '#0056b3' : '#5a6268'};
  }
`;

const EditManagerModal = ({ manager, onSave, onCancel, isAdd = false }) => {
  const [formData, setFormData] = useState({
    name: manager?.name || '',
    email: manager?.email || '',
    contactNumber: manager?.contactNumber || '',
    password: '' // Add password field for new managers
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be exactly 10 digits';
    }

    if (isAdd && !formData.password) {
      newErrors.password = 'Password is required for new managers';
    }

    if (isAdd && formData.password) {
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Password must be at least 8 characters and contain letters, numbers, and special characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...manager,
        ...formData
      });
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>{isAdd ? 'Add New Manager' : 'Edit Manager'}</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Name</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            {errors.name && <span style={{color: 'red'}}>{errors.name}</span>}
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            {errors.email && <span style={{color: 'red'}}>{errors.email}</span>}
          </FormGroup>

          <FormGroup>
            <Label>Contact Number</Label>
            <Input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
              maxLength="10"
            />
            {errors.contactNumber && <span style={{color: 'red'}}>{errors.contactNumber}</span>}
          </FormGroup>

          {isAdd && (
            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              {errors.password && <span style={{color: 'red'}}>{errors.password}</span>}
            </FormGroup>
          )}

          <ButtonGroup>
            <Button type="button" onClick={onCancel}>Cancel</Button>
            <Button type="submit" $primary>
              {isAdd ? 'Add Manager' : 'Save Changes'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditManagerModal;