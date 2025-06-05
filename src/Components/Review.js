import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 10px;
  font-weight: 600;
  color: #2c3e50;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  color: white;
  background-color: #007bff;

  &:hover {
    background-color: #0056b3;
  }
`;

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    userID: '',
    hotelID: '',
    rating: '',
    comment: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5217/api/Reviews', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMessage('Review details stored successfully!');
      setFormData({
        userID: '',
        hotelID: '',
        rating: '',
        comment: '',
      });
    } catch (err) {
      setError('Failed to store review details. Please try again.');
    }
  };

  return (
    <Container>
      <Title>Store Review Details</Title>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="userID">User ID</Label>
        <Input
          type="text"
          id="userID"
          name="userID"
          value={formData.userID}
          onChange={handleChange}
          required
        />

        <Label htmlFor="hotelID">Hotel ID</Label>
        <Input
          type="text"
          id="hotelID"
          name="hotelID"
          value={formData.hotelID}
          onChange={handleChange}
          required
        />

        <Label htmlFor="rating">Rating (1-5)</Label>
        <Input
          type="number"
          id="rating"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          min="1"
          max="5"
          required
        />

        <Label htmlFor="comment">Comment</Label>
        <TextArea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          rows="4"
          maxLength="1000"
          required
        />

        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
};

export default ReviewForm;