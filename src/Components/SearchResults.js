import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding: 24px;
`;

const HotelCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
`;

const HotelImage = styled.div`
  height: 200px;
  background: ${props => `url(${props.$imageSrc})`};
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
`;

const HotelRating = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
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
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 1.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: #666;

  strong {
    min-width: 100px;
    color: #2c3e50;
  }
`;

const AmenitiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const AmenityTag = styled.span`
  background: #e9ecef;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  color: #495057;
`;

const ViewButton = styled(Link)`
  display: block;
  background: #007bff;
  color: white;
  text-decoration: none;
  padding: 12px;
  text-align: center;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background: #0056b3;
    color: white;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: white;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  margin: 24px;
`;

const NoResults = styled.div`
  text-align: center;
  color: white;
  padding: 32px;
  font-size: 1.2rem;
`;

const SearchResults = ({ hotels, loading, error }) => {
    const images = [
        '/Images/1390015.jpg',
        '/Images/362619.jpg',
        '/Images/366875.jpg',
        '/Images/379773.jpg'
    ];
    const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    };
    if (loading) {
        return <LoadingSpinner>Loading...</LoadingSpinner>;
    }

    if (error) {
        return <ErrorMessage>{error}</ErrorMessage>;
    }

    if (!hotels?.length) {
        return <NoResults>No hotels found matching your criteria.</NoResults>;
    }

    return (
        <ResultsGrid>
            {hotels.map((hotel) => (
                <HotelCard key={hotel.hotelID}>
                    <HotelImage $imageSrc={getRandomImage()}>
                        <HotelRating>{hotel.rating} ⭐</HotelRating>
                    </HotelImage>
                    <CardContent>
                        <HotelName>{hotel.name}</HotelName>
                        
                        <InfoRow>
                            <strong>Location:</strong> 
                            <span>{hotel.location}</span>
                        </InfoRow>

                        <AmenitiesList>
                            {hotel.amenities.split(',').map((amenity, index) => (
                                <AmenityTag key={index}>
                                    {amenity.trim()}
                                </AmenityTag>
                            ))}
                        </AmenitiesList>

                        <ViewButton to={`/hotel-details/${hotel.hotelID}`}>
                            View Details
                        </ViewButton>
                    </CardContent>
                </HotelCard>
            ))}
        </ResultsGrid>
    );
};


export default SearchResults;