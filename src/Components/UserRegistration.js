import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const FormContainer = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  background-color: #ffffff;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #2c3e50;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const ErrorText = styled.span`
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
`;

const SubmitButton = styled.button`
  grid-column: 1 / -1;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
  text-align: center;
  background-color: ${props => props.isError ? '#f8d7da' : '#d4edda'};
  color: ${props => props.isError ? '#721c24' : '#155724'};
`;

const HelperText = styled.span`
  color: #666;
  font-size: 12px;
  margin-top: 4px;
  font-style: italic;
`;

const ValidationMessage = styled.div`
  padding: 8px;
  margin: 5px 0;
  border-radius: 4px;
  font-size: 13px;
  background-color: ${props => props.type === 'success' ? '#d4edda' : '#fff3cd'};
  color: ${props => props.type === 'success' ? '#155724' : '#856404'};
  border: 1px solid ${props => props.type === 'success' ? '#c3e6cb' : '#ffeeba'};
`;

const UserRegistration = () => {
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        contactNumber: "",
        role: "",
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (!/^[A-Za-z\s]{2,30}$/.test(formData.name.trim())) {
            newErrors.name = "Name must be 2-30 characters long and contain only letters and spaces";
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = "Invalid email format (example: user@example.com)";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else {
            const passwordChecks = {
                length: formData.password.length >= 8,
                letter: /[A-Za-z]/.test(formData.password),
                number: /\d/.test(formData.password),
                special: /[@$!%*#?&]/.test(formData.password)
            };

            if (!Object.values(passwordChecks).every(Boolean)) {
                newErrors.password = {
                    requirements: passwordChecks,
                    message: "Password must meet all requirements"
                };
            }
        }

        // Contact number validation
        if (!formData.contactNumber) {
            newErrors.contactNumber = "Contact number is required";
        } else if (!/^[1-9][0-9]{9}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = "Must be 10 digits and start with 1-9";
        }

        // Role validation
        if (!formData.role) {
            newErrors.role = "Please select a role";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.post('https://localhost:7125/api/User', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data) {
                setMessage(`Registration successful! Welcome ${response.data.name}`);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage(
                error.response?.data?.message || 
                error.message || 
                "Registration failed. Please check if the server is running."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer>
            {message && (
                <Message $isError={message.includes("failed")}>
                    {message}
                </Message>
            )}

            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                    />
                    <HelperText>Use only letters and spaces (2-30 characters)</HelperText>
                    {errors.name && <ErrorText>{errors.name}</ErrorText>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="user@example.com"
                    />
                    <HelperText>Enter a valid email address</HelperText>
                    {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter password"
                    />
                    <HelperText>
                        Password requirements:
                        {errors.password?.requirements ? (
                            <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                                <li style={{ color: errors.password.requirements.length ? 'green' : 'red' }}>
                                    At least 8 characters
                                </li>
                                <li style={{ color: errors.password.requirements.letter ? 'green' : 'red' }}>
                                    At least one letter
                                </li>
                                <li style={{ color: errors.password.requirements.number ? 'green' : 'red' }}>
                                    At least one number
                                </li>
                                <li style={{ color: errors.password.requirements.special ? 'green' : 'red' }}>
                                    At least one special character (@$!%*#?&)
                                </li>
                            </ul>
                        ) : null}
                    </HelperText>
                    {errors.password?.message && <ErrorText>{errors.password.message}</ErrorText>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                        id="contactNumber"
                        type="tel"
                        value={formData.contactNumber}
                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                        maxLength="10"
                        placeholder="Enter 10-digit number"
                    />
                    <HelperText>10 digits starting with 1-9 (e.g., 9876543210)</HelperText>
                    {errors.contactNumber && <ErrorText>{errors.contactNumber}</ErrorText>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="role">Role</Label>
                    <Select
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="">Select your role</option>
                        <option value="guest">Guest</option>
                        <option value="manager">Manager</option>
                    </Select>
                    <HelperText>Choose your role in the system</HelperText>
                    {errors.role && <ErrorText>{errors.role}</ErrorText>}
                </FormGroup>

                <SubmitButton type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </SubmitButton>
            </Form>
        </FormContainer>
    );
};

export default UserRegistration;