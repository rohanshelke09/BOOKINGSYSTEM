import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  min-height: 100vh;
`;

const Header = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HotelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  padding: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 10px;
  }
`;

const HotelCard = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
`;

const HotelImage = styled.div`
  height: 200px;
  background-image: ${props => `url(${props.$imageSrc})`};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const RatingBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0,0,0,0.7);
  color: gold;
  padding: 8px 12px;
  border-radius: 20px;
  font-weight: bold;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const HotelName = styled.h3`
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.3rem;
`;

const InfoRow = styled.p`
  margin: 10px 0;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
  
  strong {
    color: #2c3e50;
  }
`;

const ViewButton = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  margin-top: 15px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #007bff;
  font-size: 1.2rem;

  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #007bff;
    border-radius: 50%;
    margin: 20px auto;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #721c24;
  background-color: #f8d7da;
  padding: 15px 20px;
  border-radius: 8px;
  text-align: center;
  margin: 20px auto;
  max-width: 600px;
`;

const NoHotelsMessage = styled.div`
  text-align: center;
  margin: 40px 0;
  color: #6c757d;
  font-size: 1.2rem;
`;

const GetAvailableHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getRandomImage = () => {
        const images = [
            '/Images/1390015.jpg',
            '/Images/362619.jpg',
            '/Images/366875.jpg',
            '/Images/379773.jpg',
           '/Images/726824.jpg',
           '/Images/726853.jpg',
           '/Images/726862.jpg',
           '/Images/726872.jpg',
           '/Images/726880.jpg',
           '/Images/726888.jpg',
           '/Images/726889.jpg',
           '/Images/726935.jpg',
           
        ];
        return images[Math.floor(Math.random() * images.length)];
    };

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get('https://localhost:7125/api/Hotels/AvailableHotels');
                setHotels(response.data);
            } catch (error) {
                setError(error.response?.data || 'Failed to fetch hotels');
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    if (loading) {
        return (
            <LoadingSpinner>
                <div className="spinner" />
                <p>Loading available hotels...</p>
            </LoadingSpinner>
        );
    }

    if (error) {
        return <ErrorMessage>{error}</ErrorMessage>;
    }

    if (!hotels.length) {
        return <NoHotelsMessage>No hotels with available rooms found.</NoHotelsMessage>;
    }

    return (
        <PageContainer>
            <Header>Available Hotels</Header>
            <HotelsGrid>
                {hotels.map(hotel => (
                    <HotelCard key={hotel.hotelID}>
                        <HotelImage $imageSrc={getRandomImage()}>
                            <RatingBadge>{hotel.rating} ⭐</RatingBadge>
                        </HotelImage>
                        <CardContent>
                            <HotelName>{hotel.name}</HotelName>
                            <InfoRow>
                                <span role="img" aria-label=""></span>
                                <strong>Hotel-Name:</strong> {hotel.hotelName}
                            </InfoRow>
                            <InfoRow>
                                
                                <span role="img" aria-label="location">📍</span>
                                <strong>Location:</strong> {hotel.location}
                            </InfoRow>
                            <InfoRow>
                                <span role="img" aria-label="rooms">🏠</span>
                                <strong>Available Rooms:</strong> {hotel.availableRoomsCount}
                            </InfoRow>
                            <ViewButton to={`/hotel-details/${hotel.hotelID}`}>
                                View Details
                            </ViewButton>
                        </CardContent>
                    </HotelCard>
                ))}
            </HotelsGrid>
        </PageContainer>
    );
};

export default GetAvailableHotels;