import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import axios from 'axios';
import {
  PageContainer,
  HeaderSection,
  Title,
  ContentCard,
  Table,
  Th,
  Td,
  Tr,
  ActionButton,
  ButtonGroup,
  LoadingSpinner,
  Message
} from '../Styles/ManagePageStyles';
import styled from 'styled-components';


const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background: #f8fafc;
  border-radius: 8px;

  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    outline: none;
    font-size: 0.95rem;

    &:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
    }

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

const ManageReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:7125/api/Reviews');
      setReviews(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const handleEditReview = async (reviewId) => {
    const review = reviews.find(r => r.reviewID === reviewId);
    if (!review) {
      setError('Review not found!');
      return;
    }
    
    const updatedComment = prompt('Enter new comment:', review.comment);
    const updatedRating = prompt('Enter new rating (1-5):', review.rating);
    
    if (updatedComment && updatedRating) {
      const ratingNum = parseInt(updatedRating, 10);
      if (ratingNum < 1 || ratingNum > 5) {
        setError('Rating must be between 1 and 5');
        return;
      }

      try {
        await axios.patch(`https://localhost:7125/api/Reviews/${reviewId}`, {
          ...review,
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
        setSuccessMessage('Review updated successfully!');
      } catch (err) {
        console.error(err);
        setError('Failed to update review. Please try again.');
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
        setSuccessMessage('Review deleted successfully!');
      } catch (err) {
        console.error(err);
        setError('Failed to delete review. Please try again.');
      }
    }
  };

  const filteredReviews = reviews.filter(review =>
    review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.rating.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>Loading reviews...</LoadingSpinner>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <HeaderSection>
        <ButtonGroup>
          <ActionButton onClick={() => navigate('/admin-dashboard')}>
            <FiArrowLeft /> Back to Dashboard
          </ActionButton>
        </ButtonGroup>
        <Title>Manage Reviews</Title>
        <ButtonGroup>
          {/* Placeholder for symmetry */}
          <div style={{ width: '120px' }} />
        </ButtonGroup>
      </HeaderSection>

      <ContentCard>
        <SearchBar>
          <input
            type="text"
            placeholder="Search reviews by comment or rating..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ActionButton>
            <FiSearch /> Search
          </ActionButton>
        </SearchBar>

        {error && <Message $type="error">{error}</Message>}
        {successMessage && <Message $type="success">{successMessage}</Message>}

        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>User</Th>
              <Th>Hotel</Th>
              <Th>Rating</Th>
              <Th>Comment</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map(review => (
              <Tr key={review.reviewID}>
                <Td>{review.reviewID}</Td>
                <Td>{review.userID || 'N/A'}</Td>
                <Td>{review.hotelID || 'N/A'}</Td>
                <Td>{review.rating}</Td>
                <Td>{review.comment}</Td>
                <Td>
                  <ButtonGroup>
                    <ActionButton onClick={() => handleEditReview(review.reviewID)}>
                      <FiEdit2 /> Edit
                    </ActionButton>
                    <ActionButton $variant="danger" onClick={() => handleDeleteReview(review.reviewID)}>
                      <FiTrash2 /> Delete
                    </ActionButton>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </ContentCard>
    </PageContainer>
  );
};

export default ManageReviews;

