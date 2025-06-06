import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 800px;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  text-align: left;
  font-weight: 600;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: white;
  background-color: ${props => (props.variant === 'edit' ? '#007bff' : '#dc3545')};

  &:hover {
    background-color: ${props => (props.variant === 'edit' ? '#0056b3' : '#c82333')};
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #5a6268;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #007bff;
  font-size: 18px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #dc3545;
  background-color: #ffe6e6;
  border-radius: 8px;
  margin: 20px auto;
  max-width: 800px;
`;

const ManageReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://localhost:7125/api/Reviews');
        setReviews(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleEditReview = async (reviewId) => {
    const review = reviews.find(r => r.reviewID === reviewId);
    if (!review) {
      alert('Review not found!');
      return;
    }
    
    const updatedComment = prompt('Enter new comment:', review.comment);
    const updatedRating = prompt('Enter new rating (1-5):', review.rating);
    
    if (updatedComment && updatedRating) {
      const ratingNum = parseInt(updatedRating, 10);
      if (ratingNum < 1 || ratingNum > 5) {
        alert('Rating must be between 1 and 5');
        return;
      }

      try {
        await axios.put(`https://localhost:7125/api/Reviews/${reviewId}`, {
          reviewID: review.reviewID,
          userID: review.userID,
          hotelID: review.hotelID,
          comment: updatedComment,
          rating: ratingNum
        });

        setReviews(prevReviews =>
          prevReviews.map(r =>
            r.reviewID === reviewId
              ? { ...r, comment: updatedComment, rating: ratingNum }
              : r
          )
        );
      } catch (err) {
        console.error(err);
        alert('Failed to update review. Please try again.');
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`https://localhost:7125/api/Reviews/${reviewId}`);
        setReviews(prevReviews => 
          prevReviews.filter(review => review.reviewID !== reviewId)
        );
      } catch (err) {
        console.error(err);
        alert('Failed to delete review. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div>Loading reviews...</div>
        </LoadingSpinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => navigate('/admin-dashboard')}>
        Back to Dashboard
      </BackButton>
      <Title>Manage Reviews</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>User</TableHeader>
            <TableHeader>Hotel</TableHeader>
            <TableHeader>Rating</TableHeader>
            <TableHeader>Comment</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {reviews.map(review => (
            <TableRow key={review.reviewID}>
              <TableCell>{review.reviewID}</TableCell>
              <TableCell>{review.userID || 'N/A'}</TableCell>
              <TableCell>{review.hotelID || 'N/A'}</TableCell>
              <TableCell>{review.rating}</TableCell>
              <TableCell>{review.comment}</TableCell>
              <TableCell>
                <ActionButton variant="edit" onClick={() => handleEditReview(review.reviewID)}>
                  Edit
                </ActionButton>
                <ActionButton variant="delete" onClick={() => handleDeleteReview(review.reviewID)}>
                  Delete
                </ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManageReviews;