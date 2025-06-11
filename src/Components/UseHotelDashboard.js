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
    // occupancyRate: 0,
    // revenue: 0,
    availableRooms: 0
  });

  const calculateOccupancyRate = (bookings, totalRooms) => {
    if (!Array.isArray(bookings) || bookings.length === 0 || !totalRooms) return 0;
    
    const currentDate = new Date();
    
    // Count currently active bookings
    const activeBookings = bookings.filter(booking => {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      return (
        (booking.status === 'confirmed' || booking.status === 'checked-in') &&
        currentDate >= checkIn &&
        currentDate <= checkOut
      );
    });

    // Calculate occupancy rate based on active bookings and total rooms
    const occupiedRooms = activeBookings.length;
    const rate = (occupiedRooms / totalRooms) * 100;
    
    console.log('Occupancy calculation:', {
      occupied: occupiedRooms,
      totalRooms: totalRooms,
      rate: rate
    });

    // Return rate with one decimal place
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

  // const calculateRevenue = (bookings) => {
  //   if (!Array.isArray(bookings)) return 0;
  //   const revenue = bookings.reduce((total, booking) => {
  //     if (booking.status === 'confirmed') {
  //       return total + (booking.amount || 0);
  //     }
  //     return total;
  //   }, 0);
  //   return revenue;
  // };

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

        // Fetch bookings and rooms only have hotel
        if (currentHotelId) {
          const [bookingsResponse, roomsResponse] = await Promise.all([
            axios.get(`https://localhost:7125/api/Bookings/hotel/${currentHotelId}`, {
              headers: { Authorization: `Bearer ${tokenObj.token}` }
            }),
            axios.get(`https://localhost:7125/api/Rooms/${currentHotelId}/rooms`, {
              headers: { Authorization: `Bearer ${tokenObj.token}` }
            })
          ]);

          const bookingsData = bookingsResponse.data || [];
          const roomsData = roomsResponse.data || [];
          const totalRooms = roomsData.length;

          setBookings(bookingsData);
          setRooms(roomsData);

          setStats({
            totalBookings: bookingsData.length,
            occupancyRate: calculateOccupancyRate(bookingsData, totalRooms),
            // revenue: calculateRevenue(bookingsData),
            availableRooms: calculateAvailableRooms(roomsData)
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