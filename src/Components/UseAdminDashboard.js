import { useState, useEffect } from 'react';
import axios from 'axios';

const UseAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    users: [],
    guests: [],
    managers: [],
    hotels: [],
    bookings: [],
    reviews: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const tokenObj = token ? JSON.parse(token) : null;

        if (!tokenObj?.token) {
          throw new Error('Authentication required');
        }

        const headers = { 
          Authorization: `Bearer ${tokenObj.token}`,
          'Content-Type': 'application/json'
        };

        const [
          usersResponse,
          guestsResponse,
          managersResponse,
          hotelsResponse,
          bookingsResponse,
          reviewsResponse
        ] = await Promise.all([
          axios.get('https://localhost:7125/api/User', { headers }),
          axios.get('https://localhost:7125/api/User/by-role/guest', { headers }),
          axios.get('https://localhost:7125/api/User/by-role/manager', { headers }),
          axios.get('https://localhost:7125/api/Hotels', { headers }),
          axios.get('https://localhost:7125/api/Bookings', { headers }),
          axios.get('https://localhost:7125/api/Reviews', { headers })
        ]);

        setDashboardData({
          users: usersResponse.data,
          guests: guestsResponse.data,
          managers: managersResponse.data,
          hotels: hotelsResponse.data,
          bookings: bookingsResponse.data,
          reviews: reviewsResponse.data
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { ...dashboardData, loading, error };
};

export default UseAdminDashboard;