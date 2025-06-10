import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UseHotelDashboard = () => {
  const [hotelDetails, setHotelDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [hotelID, setHotelID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    occupancyRate: 0,

    availableRooms: 0
  });

  const calculateOccupancyRate = (bookings,rooms) => {
    if (!Array.isArray(bookings) || bookings.length === 0) return 0;
    
    const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed'||'Confirmed');
    const rate = (confirmedBookings.length / rooms.length) * 100;
    console.log('Occupancy calculation:', {
      confirmed: confirmedBookings.length,
      total: rooms.length,
      rate: rate
    });
    return parseFloat(rate.toFixed(1));
  };

  const calculateAvailableRooms = (rooms) => {
    if (!Array.isArray(rooms)) return 0;
    const availableRooms = rooms.filter(room => room.availability === true);
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
          throw new Error('Authentication token not found');
        }

        const decodedToken = jwtDecode(tokenObj.token);
        const managerId = decodedToken.nameid?.[0];

        if (!managerId) {
          throw new Error('Manager ID not found in token');
        }

        // Changed endpoint to match backend
        const hotelResponse = await axios.get(
          `https://localhost:7125/api/Hotels/by-manager/${managerId}`,
          {
            headers: {
              Authorization: `Bearer ${tokenObj.token}`
            }
          }
        );

        if (!hotelResponse.data) {
          throw new Error('No hotel assigned to this manager');
        }

        const currentHotelId = hotelResponse.data.hotelID;
        setHotelDetails(hotelResponse.data);
        setHotelID(currentHotelId);

        // Fetch bookings and rooms only if we have a hotel
        if (currentHotelId) {
          const [bookingsResponse, roomsResponse] = await Promise.all([
            axios.get(`https://localhost:7125/api/Bookings/Hotel/${currentHotelId}`, {
              headers: { Authorization: `Bearer ${tokenObj.token}` }
            }),
            axios.get(`https://localhost:7125/api/Rooms/${currentHotelId}/rooms`, {
              headers: { Authorization: `Bearer ${tokenObj.token}` }
            })
          ]);

          setBookings(bookingsResponse.data);
          setRooms(roomsResponse.data);
          console.log('Bookings:', bookingsResponse.data);
          console.log('Rooms:', roomsResponse.data);
          // Update stats only if we have valid data
          setStats({

            totalBookings: bookingsResponse.data.length || 0,
            occupancyRate: calculateOccupancyRate(bookingsResponse.data, roomsResponse.data),
     
            availableRooms: calculateAvailableRooms(roomsResponse.data)

          });
        }

        setError(null);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        
        let errorMessage = 'Failed to load dashboard data. ';
        if (error.response?.status === 404) {
          errorMessage += 'Manager is not assigned to any hotel. Please contact the administrator.';
        } else {
          errorMessage += error.message || 'Please try again later.';
        }
        
        setError(errorMessage);
        setHotelID(null);
        setHotelDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { hotelDetails, bookings, rooms, hotelID, stats, loading, error };
};

export default UseHotelDashboard;