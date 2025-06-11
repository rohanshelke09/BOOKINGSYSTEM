import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
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
const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
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
    const initialFormState = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "", // Added confirm password
        contactNumber: "",
        role: ""
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Validation rules
    const validationRules = {
        name: {
            required: true,
            pattern: /^[A-Za-z\s]{2,30}$/,
            message: "Name must be 2-30 characters long and contain only letters and spaces"
        },
        email: {
            required: true,
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email format"
        },
        password: {
            required: true,
            minLength: 8,
            pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            message: "Password must be at least 8 characters and include letters, numbers, and special characters"
        },
        contactNumber: {
            required: true,
            pattern: /^[1-9][0-9]{9}$/,
            message: "Contact number must be 10 digits and start with 1-9"
        },
        role: {
            required: true,
            message: "Please select a role"
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Validate each field
        Object.keys(validationRules).forEach(field => {
            const rule = validationRules[field];
            const value = formData[field];

            if (rule.required && !value) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            } else if (rule.pattern && !rule.pattern.test(value)) {
                newErrors[field] = rule.message;
            }
        });

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const registrationData = { ...formData };
            delete registrationData.confirmPassword; // Remove confirmPassword before sending

            const response = await axios.post(
                'https://localhost:7125/api/User', 
                registrationData,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            
            if (response.data) {
                setMessage(`Registration successful! Welcome ${response.data.name}`);
                setFormData(initialFormState);
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage(error.response?.data?.message || 
                      "Registration failed. Please try again.");
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
                        onChange={(e) => setFormData({ 
                            ...formData, 
                            name: e.target.value 
                        })}
                        placeholder="Enter your full name"
                    />
                    {errors.name && <ErrorText>{errors.name}</ErrorText>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ 
                            ...formData, 
                            email: e.target.value 
                        })}
                        placeholder="user@example.com"
                    />
                    {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="password">Password</Label>
                    <PasswordWrapper>
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData({ 
                                ...formData, 
                                password: e.target.value 
                            })}
                            placeholder="Enter password"
                        />
                        <TogglePasswordButton
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {/* {showPassword ? <FaEyeSlash /> : <FaEye />} */}
                        </TogglePasswordButton>
                    </PasswordWrapper>
                    {errors.password && <ErrorText>{errors.password}</ErrorText>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <PasswordWrapper>
                        <Input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ 
                                ...formData, 
                                confirmPassword: e.target.value 
                            })}
                            placeholder="Confirm your password"
                        />
                    </PasswordWrapper>
                    {errors.confirmPassword && (
                        <ErrorText>{errors.confirmPassword}</ErrorText>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                        id="contactNumber"
                        type="tel"
                        value={formData.contactNumber}
                        onChange={(e) => setFormData({ 
                            ...formData, 
                            contactNumber: e.target.value 
                        })}
                        maxLength="10"
                        placeholder="Enter 10-digit number"
                    />
                    {errors.contactNumber && (
                        <ErrorText>{errors.contactNumber}</ErrorText>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="role">Role</Label>
                    <Select
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ 
                            ...formData, 
                            role: e.target.value 
                        })}
                    >
                        <option value="">Select your role</option>
                        <option value="guest">Guest</option>
                        <option value="manager">Manager</option>
                    </Select>
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