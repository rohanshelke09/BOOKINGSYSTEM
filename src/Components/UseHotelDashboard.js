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

  const calculateOccupancyRate = (bookings, totalRooms) => {
    if (!Array.isArray(bookings) || !totalRooms) return 0;
    const activeBookings = bookings.filter(b => 
      b.status === 'Confirmed' && 
      new Date(b.checkOutDate) > new Date()
    );
    const rate = (activeBookings.length / totalRooms) * 100;
    return isNaN(rate) ? 0 : rate.toFixed(1);
  };

  const calculateTotalRevenue = (bookings) => {
    if (!Array.isArray(bookings)) return 0;
    return bookings
      .filter(b => b.status === 'Confirmed')
      .reduce((sum, booking) => sum + (Number(booking.totalAmount) || 0), 0);
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
 // Log managerId
 console.log('Manager ID from token:', managerId);

        const hotelResponse = await axios.get(
          `https://localhost:7125/api/Hotels/by-manager/${managerId}`,
          {
            headers: {
              Authorization: `Bearer ${tokenObj.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        
 if (!hotelResponse.data?.hotelID) {
   throw new Error('No hotel ID found in response');
 }

        setHotelDetails(hotelResponse.data);
        setHotelID(hotelResponse.data.hotelID);
       
 // Log hotelID after setting
 console.log('Set hotelID to:', hotelResponse.data.hotelID);

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

          setBookings(bookingsResponse.data);
          setStats({
            totalBookings: bookingsResponse.data?.length || 0,
            occupancyRate: calculateOccupancyRate(
              bookingsResponse.data,
              hotelResponse.data.totalRooms
            ),
            revenue: calculateTotalRevenue(bookingsResponse.data),
            availableRooms: Math.max(
              0,
              (hotelResponse.data.totalRooms || 0) - 
              (bookingsResponse.data?.filter(b => 
                b.status === 'Confirmed' && 
                new Date(b.checkOutDate) > new Date()
              ).length || 0)
            )
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