import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styled from 'styled-components';


const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`;

const PriceInputGroup = styled(FormGroup)`
  position: relative;
  width: 100%;
  box-sizing: border-box;

  &::before {
    content: '₹';
    position: absolute;
    left: 12px;
    top: 33px;
    color: #34495e;
    font-size: 1rem;
    z-index: 1;
  }

  input {
    width: 100%;
    padding-left: 28px;
    box-sizing: border-box;
  }
`;

const AmenitiesInputGroup = styled(FormGroup)`
  position: relative;
  width: 100%;
  box-sizing: border-box;

  svg {
    position: absolute;
    left: 12px;
    top: 35px;
    color: #34495e;
    opacity: 0.7;
  }

  input {
    width: 100%;
    padding-left: 35px;
    box-sizing: border-box;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  padding-left: ${props => props.hasIcon ? '35px' : '0.75rem'};
  border: 1px solid ${props => props.error ? '#e74c3c' : '#cbd5e0'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
`;

const NumberInput = styled(Input)`
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type=number] {
    -moz-appearance: textfield;
    padding-left: 28px !important;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.error ? '#e74c3c' : '#cbd5e0'};
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  transition: all 0.3s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &.primary {
    background: #3498db;
    color: white;
    
    &:hover {
      background: #2980b9;
    }
  }
  
  &.secondary {
    background: #95a5a6;
    color: white;
    
    &:hover {
      background: #7f8c8d;
    }
  }
`;

const Alert = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  
  &.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  &.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #3498db;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  input[type="checkbox"] {
    width: auto;
    margin-right: 0.5rem;
  }

  label {
    margin-bottom: 0;
  }
`;

const AddRoom = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        hotelID: '',
        type: '',
        price: '',
        availability: true,
        features: ''
    });

    const [errorMessage, setErrorMessage] = useState({});
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchHotelId = async () => {
            try {
                const token = localStorage.getItem('token');
                const tokenObj = token ? JSON.parse(token) : null;

                if (!tokenObj?.token) {
                    throw new Error('Authentication required');
                }

                const decodedToken = jwtDecode(tokenObj.token);
                const managerId = decodedToken.nameid?.[0];

                if (!managerId) {
                    throw new Error('Manager ID not found');
                }

                const response = await axios.get(
                    `https://localhost:7125/api/Hotels/by-manager/${managerId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${tokenObj.token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data && response.data.hotelID) {
                    setFormData(prev => ({
                        ...prev,
                        hotelID: response.data.hotelID
                    }));
                } else {
                    throw new Error('Hotel ID not found in response');
                }
            } catch (error) {
                console.error('Error fetching hotel:', error);
                setMessage('Error: Unable to fetch hotel information');
            } finally {
                setLoading(false);
            }
        };

        fetchHotelId();
    }, []);

    const validate = () => {
        let isValid = true;
        const errors = {};
        
        if (!formData.type || formData.type.trim() === '') {
            errors.type = "Room type is required";
            isValid = false;
        }

        const price = parseFloat(formData.price);
        if (!formData.price || isNaN(price) || price <= 0) {
            errors.price = "Price must be a valid number greater than 0";
            isValid = false;
        }

        if (price > 100000) {
            errors.price = "Price cannot exceed ₹100,000";
            isValid = false;
        }

        if (!formData.features || formData.features.trim() === '') {
            errors.features = "Features are required";
            isValid = false;
        }

        if (!formData.hotelID) {
            errors.hotelID = "Hotel ID is required";
            isValid = false;
        }

        setErrorMessage(errors);
        return isValid;
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (value === '' || value === '-') {
            setFormData({ ...formData, price: '' });
        } else {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                setFormData({ ...formData, price: numValue });
            }
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const token = localStorage.getItem('token');
            const tokenObj = JSON.parse(token);

            const response = await axios.post(
                `https://localhost:7125/api/Rooms/${formData.hotelID}`,
                {
                    ...formData,
                    price: parseFloat(formData.price)
                },
                {
                    headers: {
                        'Authorization': `Bearer ${tokenObj.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201 || response.status === 200) {
                setMessage("Room added successfully!");
                setTimeout(() => {
                    navigate(`/hotel-rooms/${formData.hotelID}`);
                }, 1500);
            }
        } catch (error) {
            console.error('Error adding room:', error);
            setMessage("Error adding room: " + (error.response?.data || error.message));
        }
    };

    if (loading) {
        return <LoadingSpinner>Loading...</LoadingSpinner>;
    }

    return (
        <PageContainer>
            <FormContainer>
                <Title>Add New Room</Title>
                {message && (
                    <Alert className={message.includes('Error') ? 'error' : 'success'}>
                        {message}
                    </Alert>
                )}
                
                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Room Type*</Label>
                        <Select 
                            error={errorMessage.type}
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                        >
                            <option value="">Select Room Type</option>
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Suite">Suite</option>
                            <option value="Deluxe">Deluxe</option>
                        </Select>
                        {errorMessage.type && <ErrorText>{errorMessage.type}</ErrorText>}
                    </FormGroup>

                    <PriceInputGroup>
                        <Label>Price  (₹)*</Label>
                        <NumberInput
                            type="number"
                            error={errorMessage.price}
                            value={formData.price}
                            onChange={handlePriceChange}
                            onBlur={() => {
                                if (formData.price === '') {
                                    setFormData({...formData, price: ''});
                                }
                            }}
                            min="0"
                            max="100000"
                            step="100"
                            placeholder="Enter price"
                        />
                        {errorMessage.price && <ErrorText>{errorMessage.price}</ErrorText>}
                    </PriceInputGroup>

                    <AmenitiesInputGroup>
                    <Label>Features/Amenities*</Label>
                 
                    <Input
                        type="text"
                        hasIcon
                        error={errorMessage.features}
                        value={formData.features}
                        onChange={(e) => setFormData({...formData, features: e.target.value})}
                        placeholder="WiFi, TV, AC, etc."
                    />
                    {errorMessage.features && <ErrorText>{errorMessage.features}</ErrorText>}
                </AmenitiesInputGroup>
                    <CheckboxContainer>
                        <input
                            type="checkbox"
                            id="availability"
                            checked={formData.availability}
                            onChange={(e) => setFormData({...formData, availability: e.target.checked})}
                        />
                        <Label htmlFor="availability">Room is Available</Label>
                    </CheckboxContainer>

                    <ButtonGroup>
                        <Button type="submit" className="primary">Add Room</Button>
                        <Button 
                            type="button" 
                            className="secondary"
                            onClick={() => navigate(`/hotel-rooms/${formData.hotelID}`)}
                        >
                            Cancel
                        </Button>
                    </ButtonGroup>
                </form>
            </FormContainer>
        </PageContainer>
    );
};

export default AddRoom;