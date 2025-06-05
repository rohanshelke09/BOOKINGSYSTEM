import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7125/api/Hotels';

export const useHotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL);
      setHotels(response.data);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch hotels");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateHotel = async (hotelId, updatedData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/${hotelId}`,
        updatedData
      );
      
      if (response.data) {
        setHotels(prevHotels =>
          prevHotels.map(h =>
            h.hotelID === hotelId ? { ...h, ...updatedData } : h
          )
        );
        return { success: true };
      }
    } catch (err) {
      console.error("Update error:", err);
      return { 
        success: false, 
        error: err.response?.data?.message || "Failed to update hotel" 
      };
    }
  };

  const deleteHotel = async (hotelId) => {
    try {
      await axios.delete(`${API_BASE_URL}/${hotelId}`);
      setHotels(prevHotels => 
        prevHotels.filter(h => h.hotelID !== hotelId)
      );
      return { success: true };
    } catch (err) {
      console.error("Delete error:", err);
      return { 
        success: false, 
        error: err.response?.data?.message || "Failed to delete hotel" 
      };
    }
  };

  return {
    hotels,
    loading,
    error,
    fetchHotels,
    updateHotel,
    deleteHotel
  };
};