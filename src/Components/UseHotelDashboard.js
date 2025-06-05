import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UseHotelDashboard = () => {
  const [hotelDetails, setHotelDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
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
    
    const confirmedBookings = bookings.filter(booking => booking.status === 'Confirmed');
    const rate = (confirmedBookings.length / bookings.length) * 100;
    console.log('Occupancy calculation:', {
      confirmed: confirmedBookings.length,
      total: bookings.length,
      rate: rate
    });
    return parseFloat(rate.toFixed(1));
  };

  const calculateAvailableRooms = (rooms) => {
    if (!Array.isArray(rooms)) return 0;
    const availableRooms = rooms.filter(room => room.status === 'Available');
    console.log('Available rooms calculation:', {
      available: availableRooms.length,
      total: rooms.length
    });
    return availableRooms.length;
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

        // Get hotel details
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
        const currentHotelId = hotelResponse.data.hotelID;
        setHotelID(currentHotelId);

        if (currentHotelId) {
          // Get bookings
          const bookingsResponse = await axios.get(
            `https://localhost:7125/api/Bookings/Hotel/${currentHotelId}`,
            {
              headers: {
                Authorization: `Bearer ${tokenObj.token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          // Get rooms
          const roomsResponse = await axios.get(
            `https://localhost:7125/api/Rooms/${currentHotelId}`,
            {
              headers: {
                Authorization: `Bearer ${tokenObj.token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          const bookingsData = bookingsResponse.data;
          const roomsData = roomsResponse.data;
          
          setBookings(bookingsData);
          setRooms(roomsData);

          // Update stats with actual available rooms
          setStats({
            totalBookings: bookingsData?.length || 0,
            occupancyRate: calculateOccupancyRate(bookingsData),
            revenue: 0,
            availableRooms: calculateAvailableRooms(roomsData)
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

  return { hotelDetails, bookings, rooms, hotelID, stats, loading, error };
};

export default UseHotelDashboard;