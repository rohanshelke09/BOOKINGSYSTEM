import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';
import SearchResults from './SearchResults';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1f35 0%, #2d3250 100%);
  padding: 40px 20px;
`;

const SearchSection = styled.div`
  max-width: 800px;
  margin: 0 auto 40px;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const SearchForm = styled.form`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 50px;
  padding: 8px 8px 8px 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 12px;
  font-size: 1.1rem;
  background: transparent;
  color: #1f2937;

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchButton = styled.button`
  background: #4f46e5;
  color: white;
  width: 48px;
  height: 48px;
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
`;

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllHotels();
  }, []);

  const fetchAllHotels = async () => {
    try {
      const response = await axios.get('https://localhost:7125/api/Hotels');
      setHotels(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!searchTerm.trim()) {
      fetchAllHotels();
      return;
    }

    try {
      const response = await axios.get('https://localhost:7125/api/Hotels/Search', {
        params: {
          searchTerm: searchTerm.trim().toLowerCase(),
          fields: ['name', 'location', 'description']
        }
      });

      if (response.data.length === 0) {
        setError('No hotels found matching your search.');
        setHotels([]);
      } else {
        setHotels(response.data);
        setError(null);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search as user types (with debounce)
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm) {
        handleSearch({ preventDefault: () => {} });
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  return (
    <Container>
      <SearchSection>
        <Title>Find Your Perfect Stay</Title>
        <SearchForm onSubmit={handleSearch}>
          <SearchBar>
            <SearchInput
              type="text"
              placeholder="Enter location or hotel name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
            />
            <SearchButton type="submit">
              <FiSearch size={20} />
            </SearchButton>
          </SearchBar>
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