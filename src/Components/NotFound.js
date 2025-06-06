import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 6rem;
  color: #2c3e50;
  margin: 0;
`;

const Message = styled.p`
  font-size: 1.5rem;
  color: #7f8c8d;
  margin: 20px 0;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>404</Title>
      <Message>Oops! The page you're looking for doesn't exist.</Message>
      <Button onClick={() => navigate('/')}>Return Home</Button>
    </Container>
  );
};

export default NotFound;