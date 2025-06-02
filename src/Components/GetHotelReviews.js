import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const ReviewsContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ReviewCard = styled.div`
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  background-color: #f8f9fa;
  border-left: 4px solid #007bff;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Rating = styled.div`
  color: #ffc107;
  font-size: 1.1rem;
`;

const Comment = styled.p`
  color: #495057;
  margin: 0;
  line-height: 1.5;
`;

const NoReviews = styled.p`
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 20px;
`;

const AddReviewForm = styled.form`
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const TextArea = styled.textarea`
  width: 95%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin-bottom: 15px;
  min-height: 100px;
  resize: vertical;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }
`;

const RatingSelect = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ced4da;
  border-radius: 4px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const GetHotelReviews = ({ hotelID }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [hotelID]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`https://localhost:7125/api/Reviews/Hotel/${hotelID}`);
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch reviews');
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const tokenData = JSON.parse(localStorage.getItem('token'));
    
    try {
      await axios.post('https://localhost:7125/api/Reviews', {
        userID: tokenData.userId,
        hotelID: hotelID,
        rating: parseInt(newReview.rating),
        comment: newReview.comment
      }, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`
        }
      });
      
      // Reset form and refresh reviews
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>{error}</div>;

  return (
    <ReviewsContainer>
      <h2>Hotel Reviews</h2>
      
      <AddReviewForm onSubmit={handleSubmitReview}>
        <h3>Add Your Review</h3>
        <RatingSelect
          value={newReview.rating}
          onChange={(e) => setNewReview(prev => ({ ...prev, rating: e.target.value }))}
        >
          {[5, 4, 3, 2, 1].map(num => (
            <option key={num} value={num}>{num} Stars</option>
          ))}
        </RatingSelect>
        
        <TextArea
          placeholder="Write your review here..."
          value={newReview.comment}
          onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
          required
        />
        
        <SubmitButton type="submit" disabled={!newReview.comment.trim()}>
          Submit Review
        </SubmitButton>
      </AddReviewForm>

      {reviews.length === 0 ? (
        <NoReviews>No reviews yet. Be the first to review!</NoReviews>
      ) : (
        reviews.map((review) => (
          <ReviewCard key={review.id}>
            <ReviewHeader>
              <Rating>{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</Rating>
            </ReviewHeader>
            <Comment>{review.comment}</Comment>
          </ReviewCard>
        ))
      )}
    </ReviewsContainer>
  );
};

export default GetHotelReviews;