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
      const patchData = {
        name: updatedData.name?.trim(),
        location: updatedData.location?.trim(),
        managerID: parseInt(updatedData.managerID, 10),
        amenities: updatedData.amenities?.trim()
      };

      // Validate data before sending
      if (!patchData.name || patchData.name.length > 200) {
        return { success: false, error: 'Invalid hotel name' };
      }

      if (!patchData.location || patchData.location.length > 500) {
        return { success: false, error: 'Invalid location' };
      }

      if (!patchData.managerID || isNaN(patchData.managerID)) {
        return { success: false, error: 'Invalid manager ID' };
      }

      const response = await axios.patch(
        `${API_BASE_URL}/${hotelId}`,
        patchData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        setHotels(prevHotels =>
          prevHotels.map(h =>
            h.hotelID === hotelId ? { ...h, ...patchData } : h
          )
        );
        return { success: true, message: 'Hotel updated successfully' };
      }

      throw new Error('Update failed');
    } catch (err) {
      console.error("Update error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        requestData: { hotelId, updatedData }
      });

      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to update hotel',
        validationErrors: err.response?.data?.errors
      };
    }
  };

  const deleteHotel = async (hotelId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${hotelId}`);
      if (response.status === 200) {
        setHotels(prevHotels => 
          prevHotels.filter(h => h.hotelID !== hotelId)
        );
        return { 
          success: true,
          message: 'Hotel deleted successfully'
        };
      }
      throw new Error('Delete failed');
    } catch (err) {
      console.error("Delete error:", {
        status: err.response?.status,
        message: err.message,
        hotelId
      });
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