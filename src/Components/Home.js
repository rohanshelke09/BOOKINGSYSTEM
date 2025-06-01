import React, { useState } from "react";
import styled from 'styled-components';
import axios from 'axios';
import SearchResults from './SearchResults';

const Container = styled.div`
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), 
              url('/images/362619.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  padding: 20px;
`;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: white;
  margin-top: 2px;
`;

const SearchInput = styled.input`
  width: 50%;
  padding: 9px;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-bottom: 20px;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  margin-bottom: 20px;
`;

const SearchButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
`;

const AMENITIES = ["WiFi", "Parking", "Pool", "Gym", "Restaurant"];

const Home = () => {
    const [searchParams, setSearchParams] = useState({
        location: '',
        amenities: []
    });
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setShowResults(true);

        try {
            const token = localStorage.getItem('token');
            const tokenObj = token ? JSON.parse(token) : null;

            const response = await axios.get('https://localhost:7125/api/Hotels/Search', {
                params: {
                    location: searchParams.location,
                    amenities: searchParams.amenities.join(',')
                },
                headers: {
                    Authorization: `Bearer ${tokenObj?.token}`,
                    'Content-Type': 'application/json'
                }
            });

            setHotels(response.data);
        } catch (err) {
            setError('Failed to fetch hotels. Please try again.');
            console.error('Search failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAmenityChange = (amenity) => {
        setSearchParams(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    return (
        <Container>
            <Title>Welcome to Hotel Booking System</Title>
            <SearchContainer>
                <form onSubmit={handleSearch}>
                    <SearchInput
                        type="text"
                        placeholder="Search by location..."
                        value={searchParams.location}
                        onChange={(e) => setSearchParams(prev => ({
                            ...prev,
                            location: e.target.value
                        }))}
                    />

                    <ToggleButton
                        type="button"
                        onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    >
                        {showAdvancedSearch ? "Hide" : "Show"} Advanced Search Options
                    </ToggleButton>

                    {showAdvancedSearch && (
                        <AmenitiesGrid>
                            {AMENITIES.map((amenity) => (
                                <label key={amenity}>
                                    <input
                                        type="checkbox"
                                        checked={searchParams.amenities.includes(amenity)}
                                        onChange={() => handleAmenityChange(amenity)}
                                    />
                                    {amenity}
                                </label>
                            ))}
                        </AmenitiesGrid>
                    )}

                    <SearchButton type="submit">
                        Search Hotels
                    </SearchButton>
                </form>
            </SearchContainer>

            {showResults && (
                <SearchResults 
                    hotels={hotels}
                    loading={loading}
                    error={error}
                />
            )}
        </Container>
    );
};

export default Home;