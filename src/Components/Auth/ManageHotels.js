import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  padding: 12px 15px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  &:hover {
    background-color: #f5f5f5;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
  vertical-align: middle;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: ${(props) =>
    props.variant === "edit" ? "#007bff" : "#dc3545"};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.variant === "edit" ? "#0056b3" : "#c82333"};
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.variant === "edit"
          ? "rgba(0,123,255,0.25)"
          : "rgba(220,53,69,0.25)"};
  }
`;

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5217/api/Hotels");
      console.log("Fetched hotels:", response.data);
      setHotels(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch hotels");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleEditHotel = async (hotelId) => {
    try {
      // First fetch the current hotel data
      const currentHotel = hotels.find((h) => h.hotelID === hotelId);
      if (!currentHotel) {
        alert("Hotel not found");
        return;
      }

      // Get updated values
      const updatedName = prompt("Enter new name:", currentHotel.name);
      const updatedLocation = prompt("Enter new location:", currentHotel.location);

      if (!updatedName || !updatedLocation) {
        alert("Both name and location are required");
        return;
      }

      // Create payload matching exact API format
      const updatedHotel = {
        hotelID: hotelId,            // Changed to camelCase
        name: updatedName,           // Changed to camelCase
        location: updatedLocation,   // Changed to camelCase
        managerID: currentHotel.managerID || 0,  // Preserve existing or default
        rating: currentHotel.rating || 0,        // Preserve existing or default
        amenities: currentHotel.amenities || ""  // Preserve existing or default
      };

      console.log("Sending update request:", updatedHotel);

      // Make PUT request with proper content type
      const response = await axios.put(
        `http://localhost:5217/api/Hotels/${hotelId}`,
        updatedHotel
      );
console.log(response.data)
      if (response.data) {
        // Update local state
        setHotels((prevHotels) =>
          prevHotels.map((h) =>
            h.hotelID === hotelId ? { ...h, ...updatedHotel } : h
          )
        );
        alert("Hotel updated successfully!");
      }
    } catch (err) {
      console.error("Update error details:", {
        error: err.response?.data,
        status: err.response?.status
      });
      alert("Failed to update hotel. Please check console for details.");
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await axios.delete(`http://localhost:5217/api/Hotels/${hotelId}`);
        setHotels((prevHotels) =>
          prevHotels.filter((h) => h.hotelID !== hotelId)
        );
        alert("Hotel deleted successfully!");
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete hotel");
      }
    }
  };

  if (loading) return <p>Loading hotels...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Container>
      <Title>Manage Hotels</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Location</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <TableRow key={hotel.hotelID}>
              <TableCell>{hotel.hotelID}</TableCell>
              <TableCell>{hotel.name}</TableCell>
              <TableCell>{hotel.location}</TableCell>
              <TableCell>
                <ActionButton
                  variant="edit"
                  onClick={() => handleEditHotel(hotel.hotelID)} // Pass hotelID instead of whole hotel
                >
                  Edit
                </ActionButton>
                <ActionButton
                  variant="delete"
                  onClick={() => handleDeleteHotel(hotel.hotelID)}
                >
                  Delete
                </ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManageHotels;
