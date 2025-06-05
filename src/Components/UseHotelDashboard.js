import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UseHotelDashboard = () => {
  const [hotelDetails, setHotelDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [hotelID, setHotelID] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    occupancyRate: 0,
    revenue: 0,
    availableRooms: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateOccupancyRate = (bookings) => {
    if (!Array.isArray(bookings) || bookings.length === 0) return 0;
    return (bookings.filter(b => b.status === 'Confirmed').length / bookings.length * 100).toFixed(1);
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
        const managerId = decodedToken.nameid?.[0];

        if (!managerId) {
          throw new Error('Manager ID not found');
        }

        const hotelResponse = await axios.get(
          `https://localhost:7125/api/Hotels/by-manager/${managerId}`,
          {
            headers: {
              Authorization: `Bearer ${tokenObj.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        setHotelDetails(hotelResponse.data);
        setHotelID(hotelResponse.data.hotelID);

        if (hotelResponse.data?.hotelID) {
          const bookingsResponse = await axios.get(
            `https://localhost:7125/api/Bookings/hotel/${hotelResponse.data.hotelID}`,
            {
              headers: {
                Authorization: `Bearer ${tokenObj.token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          const bookingsData = bookingsResponse.data;
          setBookings(bookingsData);

          // Calculate stats using only available data
          setStats({
            totalBookings: bookingsData?.length || 0,
            occupancyRate: calculateOccupancyRate(bookingsData),
            revenue: 0, // Set to 0 since we don't have totalAmount
            availableRooms: 0 // Set to 0 since we don't have totalRooms
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { hotelDetails, bookings, hotelID, stats, loading, error };
};

export default UseHotelDashboard;