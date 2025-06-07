import React, { useEffect, useState } from "react";
import { useHotelManagement } from "../UseHotelManagement";
import EditHotelModal from "../EditHotelModal";
import {
  Container,
  Title,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  ActionButton2
} from '../Styles';


const ManageHotels = () => {
  const { 
    hotels, 
    loading, 
    error, 
    fetchHotels, 
    updateHotel, 
    deleteHotel 
  } = useHotelManagement();
  const [editingHotel, setEditingHotel] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleEditClick = (hotel) => {
    setEditingHotel(hotel);
  };

  const handleSaveEdit = async (updatedHotel) => {
    const result = await updateHotel(updatedHotel.hotelID, updatedHotel);
    if (result.success) {
      setEditingHotel(null);
    } else {
      alert(result.error || 'Failed to update hotel');
    }
  };


  const handleDeleteClick = async (hotelId) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      const result = await deleteHotel(hotelId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  if (loading) return <Container>Loading hotels...</Container>;
  if (error) return <Container style={{ color: "red" }}>{error}</Container>;

  return (
    <Container>
      <Title>Manage Hotels</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Location</TableHeader>
            <TableHeader>Amenities</TableHeader>
            <TableHeader>Manager ID</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <TableRow key={hotel.hotelID}>
              <TableCell>{hotel.hotelID}</TableCell>
              <TableCell>{hotel.name}</TableCell>
              <TableCell>{hotel.location}</TableCell>
              <TableCell>{hotel.amenities}</TableCell>
              <TableCell>{hotel.managerID}</TableCell>
              <TableCell>
                <ActionButton2
                  $variant="edit"
                  onClick={() => handleEditClick(hotel)}
                >
                  Edit
                </ActionButton2>
                <ActionButton2
                  $variant="delete"
                  onClick={() => handleDeleteClick(hotel.hotelID)}
                >
                  Delete
                </ActionButton2>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      {editingHotel && (
        <EditHotelModal
          hotel={editingHotel}
          onSave={handleSaveEdit}
          onCancel={() => setEditingHotel(null)}
        />
      )}
    </Container>
  );
};

export default ManageHotels;