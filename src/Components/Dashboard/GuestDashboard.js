import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaEdit, FaCheckCircle } from 'react-icons/fa';
=======
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaEdit } from 'react-icons/fa';
>>>>>>> cdbec7af3389c015bb853cb166723b22d73ac7b8
import EditProfileModal from '../EditProfileModal';
const ActionButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  width: 100%;
  margin-bottom: 15px;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;
const EditButton = styled(ActionButton)`
  margin-top: 15px;
  background-color: #28a745;
  width: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;

  &:hover {
    background-color: #218838;
  }
`;
const ProfileCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
`;

const ProfileInfo = styled.div`
  display: grid;
  gap: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2c3e50;

  svg {
    color: #007bff;
  }
`;
const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #007bff, #0056b3);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 30px;
  color: white;
  text-align: center;

  h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 600;
  }

  p {
    margin-top: 10px;
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 1.5rem;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
  }
`;

<<<<<<< HEAD
=======


>>>>>>> cdbec7af3389c015bb853cb166723b22d73ac7b8
const BookingCard = styled.div`
  padding: 20px;
  margin: 15px 0;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  background-color: #f8f9fa;
  transition: all 0.2s ease;

  &:hover {
    border-color: #007bff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  p {
    margin: 8px 0;
    color: #495057;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: ${props => {
    switch (props.$status?.toLowerCase()) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }};
  color: white;
`;

const ServiceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;

  li {
    padding: 12px 0;
    border-bottom: 1px solid #e9ecef;
    color: #495057;
    display: flex;
    align-items: center;

    &:last-child {
      border-bottom: none;
    }

    &:before {
      content: "→";
      margin-right: 10px;
      color: #007bff;
    }
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #007bff;
  font-weight: 500;
`;
const ViewAllButton = styled(ActionButton)`
  background-color: transparent;
  border: 2px solid #007bff;
  color: #007bff;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;
const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    margin: 0;
    border: none;
    padding: 0;
  }
`;

const SuccessNotification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  background-color: #28a745;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideIn 0.5s ease-out;
  display: flex;
  align-items: center;
  gap: 10px;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  svg {
    font-size: 1.2em;
  }
`;

const GuestDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
<<<<<<< HEAD
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
=======
>>>>>>> cdbec7af3389c015bb853cb166723b22d73ac7b8
  const RECENT_BOOKINGS_COUNT = 1;
  const fetchUserDetails = async (userID, token) => {
    try {
      const response = await axios.get(
        `https://localhost:7125/api/User/${userID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
<<<<<<< HEAD
      
      const userData = response.data;
      setUser(userData);
      setUserLoading(false);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (err) {
      console.error('Error fetching user details:', err);
      throw err;
=======
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching user details:', err);
    } finally {
      setUserLoading(false);
>>>>>>> cdbec7af3389c015bb853cb166723b22d73ac7b8
    }
  };
  const handleEditProfile = async (updatedData) => {
    try {
<<<<<<< HEAD
      const token = JSON.parse(localStorage.getItem('token'))?.token;
      if (!token) {
        throw new Error('Authentication required');
      }
  
      const response = await axios.patch(
        `https://localhost:7125/api/User/${user.userID}`,
        updatedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
=======
      const token = localStorage.getItem('token');
      const tokenObj = token ? JSON.parse(token) : null;

      const updatedUser = {
        userID: user.userID,
        name: updatedData.name,
        email: updatedData.email,
        contactNumber: updatedData.contactNumber
      };

      const response = await axios.patch(
        `https://localhost:7125/api/User/${user.userID}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${tokenObj.token}`,
>>>>>>> cdbec7af3389c015bb853cb166723b22d73ac7b8
            'Content-Type': 'application/json'
          }
        }
      );
<<<<<<< HEAD
  
      if (response.data) {
        // Update local state
        setUser(prevUser => ({
          ...prevUser,
          ...response.data
        }));
  
        // Update localStorage
        localStorage.setItem('user', JSON.stringify({
          ...user,
          ...response.data
        }));
  
        // Set success message
        setSuccessMessage(`Profile updated successfully! Welcome, ${response.data.name}!`);
  
        // Close modal and trigger refresh
        setIsEditModalOpen(false);
        setUpdateTrigger(prev => prev + 1);
  
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }
    } catch (err) {
      console.error('Update error:', err);
      alert(err.response?.data?.message || 'Failed to update profile. Please try again.');
=======

      if (response.data) {
        setUser(response.data);
        setIsEditModalOpen(false);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update profile. Please try again.');
>>>>>>> cdbec7af3389c015bb853cb166723b22d73ac7b8
    }
  };
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const tokenObj = token ? JSON.parse(token) : null;

        if (!tokenObj?.token) {
          throw new Error('Authentication required');
        }

        const decodedToken = jwtDecode(tokenObj.token);
        const userID = decodedToken.nameid?.[0];

        if (!userID) {
          throw new Error('User ID not found');
        }

        const response = await axios.get(
          `https://localhost:7125/api/Bookings/User/${userID}`,
          {
            headers: {
              Authorization: `Bearer ${tokenObj.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        setBookings(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');
          const tokenObj = token ? JSON.parse(token) : null;
  
          if (!tokenObj?.token) {
            throw new Error('Authentication required');
          }
  
          const decodedToken = jwtDecode(tokenObj.token);
          const userID = decodedToken.nameid?.[0];
  
          if (!userID) {
            throw new Error('User ID not found');
          }
  
          // Fetch both user details and bookings
          await Promise.all([
            fetchUserDetails(userID, tokenObj.token),
<<<<<<< HEAD
            fetchBookings()
=======
            fetchBookings(userID, tokenObj.token)
>>>>>>> cdbec7af3389c015bb853cb166723b22d73ac7b8
          ]);
  
        } catch (err) {
          console.error('Error fetching data:', err);
          setError(err.message || 'Failed to fetch data');
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
<<<<<<< HEAD
    }, [updateTrigger]);
=======
    }, []);
>>>>>>> cdbec7af3389c015bb853cb166723b22d73ac7b8

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardContainer>
<<<<<<< HEAD
      {successMessage && (
        <SuccessNotification>
          <FaCheckCircle />
          {successMessage}
        </SuccessNotification>
      )}
       <WelcomeSection>
      <h1>Welcome {user?.name ? `, ${user.name}` : 'to Your Dashboard'}</h1>
=======
       <WelcomeSection>
      <h1>Welcome {user?.name ? `, ${user.name.trim()}` : 'to Your Dashboard'}</h1>
>>>>>>> cdbec7af3389c015bb853cb166723b22d73ac7b8
      <p>Manage your bookings and explore our premium hotel services</p>
    </WelcomeSection>

      <CardGrid>
      <Card>
        {userLoading ? (
          <LoadingSpinner>Loading profile...</LoadingSpinner>
        ) : (
          <>
            <h3>Profile Information</h3>
            <ProfileCard>
              <ProfileHeader>
                <Avatar>
                  {user?.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
                </Avatar>
                <h2>{user?.name || 'Guest'}</h2>
              </ProfileHeader>
              
              <ProfileInfo>
                <InfoItem>
                  <FaIdCard />
                  <span>User ID: {user?.userID}</span>
                </InfoItem>
                <InfoItem>
                  <FaEnvelope />
                  <span>{user?.email}</span>
                </InfoItem>
                <InfoItem>
                  <FaPhone />
                  <span>{user?.contactNumber || 'No phone number added'}</span>
                </InfoItem>
              </ProfileInfo>
              <EditButton onClick={() => setIsEditModalOpen(true)}>
    <FaEdit /> Edit Profile
  </EditButton>
            </ProfileCard>
          </>
        )}
      </Card>
        <Card>
        <BookingHeader>
            <h3>Recent Bookings</h3>
            <ViewAllButton 
              onClick={() => navigate('/usersallbookings')}
              style={{ margin: 0, width: 'auto' }}
            >
              View All Bookings
            </ViewAllButton>
          </BookingHeader>
          
          {loading ? (
            <LoadingSpinner>Loading your bookings...</LoadingSpinner>
          ) : error ? (
            <div style={{ color: '#dc3545', padding: '10px' }}>{error}</div>
          ) : bookings.length > 0 ? (
            <>
              {bookings
                .sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate))
                .slice(0, RECENT_BOOKINGS_COUNT)
                .map(booking => (
                  <BookingCard key={booking.bookingID}>
                    <h4>Booking #{booking.bookingID}</h4>
                    <p><strong>Room:</strong> {booking.roomID || 'Not assigned'}</p>
                    <p><strong>Check-in:</strong> {formatDate(booking.checkInDate)}</p>
                    <p><strong>Check-out:</strong> {formatDate(booking.checkOutDate)}</p>
                    <p>
                      <strong>Status: </strong>
                      <StatusBadge $status={booking.status}>
                        {booking.status}
                      </StatusBadge>
                    </p>
                  </BookingCard>
                ))}
              {bookings.length > RECENT_BOOKINGS_COUNT && (
                <p style={{ textAlign: 'center', color: '#6c757d', marginTop: '15px' }}>
                  + {bookings.length - RECENT_BOOKINGS_COUNT} more bookings
                </p>
              )}
            </>
          ) : (
            <p style={{ textAlign: 'center', color: '#6c757d' }}>
              No current bookings
            </p>
          )}
          <ActionButton onClick={() => navigate('/available-hotels')}>
            Make New Booking
          </ActionButton>
        </Card>
        
      </CardGrid>
<<<<<<< HEAD
      {successMessage && (
        <div style={{ textAlign: 'center', color: '#28a745', marginBottom: '20px' }}>
          {successMessage}
        </div>
      )}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={user}
        onSave={(updatedData) => {
          handleEditProfile(updatedData);
        }}
=======
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditProfile}
        userData={user}
>>>>>>> cdbec7af3389c015bb853cb166723b22d73ac7b8
      />
    </DashboardContainer>
  );
};

export default GuestDashboard;