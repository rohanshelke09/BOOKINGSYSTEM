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

const EditModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 1001;

  h2 {
    margin-bottom: 1.5rem;
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 1rem;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
  }

  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 1001;
  text-align: center;

  h3 {
    color: #1f2937;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  p {
    color: #4b5563;
    margin-bottom: 1.5rem;
  }
`;

const ModalButtons = styled(ButtonGroup)`
  justify-content: center;
  gap: 1rem;

  button {
    min-width: 100px;
  }
`;

const ManageReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({
    comment: '',
    rating: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingReview, setDeletingReview] = useState(null);

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

  const handleEditReview = (reviewId) => {
    const review = reviews.find(r => r.reviewID === reviewId);
    if (!review) {
      setError('Review not found!');
      return;
    }
    
    setEditingReview(review);
    setEditForm({
      comment: review.comment,
      rating: review.rating
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const ratingNum = parseInt(editForm.rating, 10);
      
      // Validate rating
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        setError('Rating must be between 1 and 5');
        setIsSubmitting(false);
        return;
      }

      // Validate comment
      if (!editForm.comment.trim()) {
        setError('Comment cannot be empty');
        setIsSubmitting(false);
        return;
      }

      const updatedReview = {
        reviewID: editingReview.reviewID,
        userID: editingReview.userID,
        hotelID: editingReview.hotelID,
        rating: ratingNum,
        comment: editForm.comment.trim()
      };

      const response = await axios.patch(
        `https://localhost:7125/api/Reviews/${editingReview.reviewID}`,
        updatedReview,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 204) {
        // Update local state
        setReviews(prevReviews =>
          prevReviews.map(r =>
            r.reviewID === editingReview.reviewID
              ? { ...r, ...updatedReview }
              : r
          )
        );
        
        setSuccessMessage('Review updated successfully!');
        setEditingReview(null);
        setError('');
      }
    } catch (err) {
      console.error('Edit error:', err);
      if (err.response?.status === 404) {
        setError('Review not found. It may have been deleted.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Invalid review data');
      } else {
        setError('Failed to update review. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (review) => {
    setDeletingReview(review);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      setError('');

      await axios.delete(`https://localhost:7125/api/Reviews/${deletingReview.reviewID}`);
      
      setReviews(prevReviews => 
        prevReviews.filter(review => review.reviewID !== deletingReview.reviewID)
      );
      
      setSuccessMessage('Review deleted successfully!');
      setDeletingReview(null);

    } catch (err) {
      if (err.response?.status === 404) {
        setError('Review not found. It may have been already deleted.');
        setReviews(prevReviews => 
          prevReviews.filter(review => review.reviewID !== deletingReview.reviewID)
        );
      } else {
        setError('Failed to delete review. Please try again.');
        console.error('Delete error:', err);
      }
    } finally {
      setLoading(false);
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
                    <ActionButton $variant="danger" onClick={() => handleDeleteClick(review)}>
                      <FiTrash2 /> Delete
                    </ActionButton>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </ContentCard>

      {editingReview && (
        <>
          <Overlay onClick={() => !isSubmitting && setEditingReview(null)} />
          <EditModal onClick={e => e.stopPropagation()}>
            <h2>Edit Review #{editingReview.reviewID}</h2>
            {error && <Message $type="error">{error}</Message>}
            <Form onSubmit={handleSaveEdit}>
              <FormGroup>
                <label>Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editForm.rating}
                  onChange={e => setEditForm(prev => ({ 
                    ...prev, 
                    rating: Math.min(5, Math.max(1, parseInt(e.target.value) || 1))
                  }))}
                  required
                  disabled={isSubmitting}
                />
              </FormGroup>
              <FormGroup>
                <label>Comment</label>
                <textarea
                  value={editForm.comment}
                  onChange={e => setEditForm(prev => ({ 
                    ...prev, 
                    comment: e.target.value
                  }))}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your review comment..."
                  maxLength={500}
                />
              </FormGroup>
              <ButtonGroup>
                <ActionButton
                  type="button"
                  onClick={() => {
                    if (!isSubmitting) {
                      setEditingReview(null);
                      setError('');
                    }
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  type="submit"
                  $variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </ActionButton>
              </ButtonGroup>
            </Form>
          </EditModal>
        </>
      )}

      {deletingReview && (
        <>
          <Overlay onClick={() => !loading && setDeletingReview(null)} />
          <ConfirmationModal>
            <h3>Delete Review</h3>
            <p>
              Are you sure you want to delete this review? 
              This action cannot be undone.
            </p>
            <ModalButtons>
              <ActionButton 
                onClick={() => setDeletingReview(null)} 
                disabled={loading}
              >
                Cancel
              </ActionButton>
              <ActionButton 
                $variant="danger" 
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </ActionButton>
            </ModalButtons>
          </ConfirmationModal>
        </>
      )}
    </PageContainer>
  );
};

export default ManageReviews;

