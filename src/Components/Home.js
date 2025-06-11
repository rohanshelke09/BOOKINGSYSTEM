import React, { useState, useEffect, useCallback } from "react";
import styled from 'styled-components';
import axios from 'axios';
import { FiSearch, FiMapPin, FiList } from 'react-icons/fi';
import SearchResults from './SearchResults';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1f35 0%, #2d3250 100%);
  padding: 40px 20px;
`;

const SearchSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 0 20px;

  @media (max-width: 1024px) {
    margin-bottom: 20px;
  }
`;

const Title = styled.h1`
  
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 3.5rem;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const SearchForm = styled.form`
  display: flex;
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const SearchGroup = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 50px;
  padding: 8px 8px 8px 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  height: 40px;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }

  &:focus-within {
    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.2);
  }

  @media (max-width: 1024px) {
    height: 50px;
  }
`;

const SearchLabel = styled.label`
  position: absolute;
  left: 25px;
  top: -10px;
  background: white;
  padding: 0 8px;
  font-size: 0.8rem;
  color: #6b7280;
  border-radius: 10px;
  z-index: 1;

  @media (max-width: 1024px) {
    font-size: 0.75rem;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 12px;
  font-size: 1rem;
  background: transparent;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 1024px) {
    font-size: 0.9rem;
  }
`;

const SearchButton = styled.button`
  background: #4f46e5;
  color: white;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #4338ca;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 1024px) {
    width: 36px;
    height: 36px;
  }
`;

const Home = () => {
  const [filters, setFilters] = useState({
    location: '',
    name: '',
    amenities: ''
  });
  const [hotels, setHotels] = useState([]);
  const [allHotels, setAllHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all hotels initially
  useEffect(() => {
    fetchAllHotels();
  }, []);

  const fetchAllHotels = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://localhost:7125/api/Hotels');
      setHotels(response.data);
      // console.log(response.data);
      setAllHotels(response.data); // Keep original list
      setError(null);
    } catch (err) {
      setError('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  
  const filterHotels = useCallback(() => {
    let filtered = [...allHotels];

    // Apply filters
    if (filters.location.trim()) {
      filtered = filtered.filter(hotel =>
        hotel.location.toLowerCase().includes(filters.location.toLowerCase().trim())
      );
    }

    if (filters.name.trim()) {
      filtered = filtered.filter(hotel =>
        hotel.name.toLowerCase().includes(filters.name.toLowerCase().trim())
      );
    }

    if (filters.amenities.trim()) {
      const amenityTerms = filters.amenities.toLowerCase().trim().split(',');
      filtered = filtered.filter(hotel =>
        amenityTerms.every(term =>
          hotel.amenities.toLowerCase().includes(term.trim())
        )
      );
    }

    // update results
    setHotels(filtered);
    setError(filtered.length === 0 ? 'No hotels match your search criteria.' : null);
  }, [filters, allHotels]);

  // handle input changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      filterHotels();
    }, 300); // 300ms delay repsonse when typing

    return () => clearTimeout(delayDebounce);
  }, [filters, filterHotels]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container>
      <SearchSection>
        <Title>Find Your Perfect Stay</Title>
        <SearchForm onSubmit={(e) => e.preventDefault()}>
          <SearchGroup>
            {/* <SearchLabel>Hotel Name</SearchLabel> */}
            <SearchContainer>
              <SearchInput
                type="text"
                name="name"
                placeholder="Search by name..."
                value={filters.name}
                onChange={handleInputChange}
                autoComplete="off"
              />
              <SearchButton type="submit">
                <FiSearch size={20} />
              </SearchButton>
            </SearchContainer>
          </SearchGroup>

          <SearchGroup>
            {/* <SearchLabel>Location</SearchLabel> */}
            <SearchContainer>
              <SearchInput
                type="text"
                name="location"
                placeholder="Enter location..."
                value={filters.location}
                onChange={handleInputChange}
                autoComplete="off"
              />
              <SearchButton type="submit">
                <FiMapPin size={20} />
              </SearchButton>
            </SearchContainer>
          </SearchGroup>

          <SearchGroup>
            {/* <SearchLabel>Amenities</SearchLabel> */}
            <SearchContainer>
              <SearchInput
                type="text"
                name="amenities"
                placeholder="Enter amenities..."
                value={filters.amenities}
                onChange={handleInputChange}
                autoComplete="off"
              />
              <SearchButton type="submit">
                <FiList size={20} />
              </SearchButton>
            </SearchContainer>
          </SearchGroup>
        </SearchForm>
      </SearchSection>

      <SearchResults 
        hotels={hotels}
        loading={loading}
        error={error}
      />
    </Container>
  );
};

export default Home;