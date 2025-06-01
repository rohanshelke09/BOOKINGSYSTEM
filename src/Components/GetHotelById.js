import React, { useEffect, useState } from "react";
import { useParams ,useNavigate} from "react-router-dom";
import axios from "axios";

const GetHotelsById = () => {
  const { hotelID } = useParams();
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const navigate = useNavigate();

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "40px auto",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      backgroundColor: "#ffffff",
      fontFamily: "Arial, sans-serif"
    },
    header: {
      textAlign: "center",
      color: "#2c3e50",
      marginBottom: "30px",
      fontSize: "28px",
      fontWeight: "600"
    },
    detailsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "15px",
      borderBottom: "1px solid #eee",
      transition: "background-color 0.2s ease",
      '&:hover': {
        backgroundColor: "#f8f9fa"
      }
    },
    label: {
      fontWeight: "600",
      color: "#34495e",
      flex: "0 0 120px"
    },
    value: {
      color: "#2c3e50",
      flex: "1",
      textAlign: "right"
    },
    datePickerContainer: {
      marginTop: "30px",
      textAlign: "center"
    },
    dateInput: {
      padding: "12px",
      marginRight: "15px",
      borderRadius: "6px",
      border: "1px solid #dcdfe6",
      fontSize: "14px",
      transition: "border-color 0.2s ease",
      outline: "none",
      "&:focus": {
        borderColor: "#007bff",
        boxShadow: "0 0 0 2px rgba(0,123,255,0.25)"
      }
    },
    button: {
      padding: "12px 24px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginTop: "20px",
      "&:hover": {
        backgroundColor: "#0056b3"
      },
      "&:disabled": {
        backgroundColor: "#cccccc",
        cursor: "not-allowed",
        opacity: 0.7
      }
    },
    errorMessage: {
      textAlign: "center",
      color: "#dc3545",
      padding: "15px",
      backgroundColor: "#f8d7da",
      borderRadius: "6px",
      marginTop: "20px"
    },
    loadingSpinner: {
      width: "50px",
      height: "50px",
      border: "5px solid #f3f3f3",
      borderTop: "5px solid #007bff",
      borderRadius: "50%",
      margin: "20px auto",
      animation: "spin 1s linear infinite"
    }
  };

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(`https://localhost:7125/api/Hotels/${hotelID}`);
        setHotel(response.data);
      } catch (error) {
        setError("Error fetching hotel: " + error.message);
      }
    };

    if (hotelID) {
      fetchHotel();
    }
  }, [hotelID]);

  if (error) {
    return <div style={styles.errorMessage}>{error}</div>;
  }

  if (!hotel) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <div style={styles.loadingSpinner}></div>
        <p style={{ color: "#666", marginTop: "15px" }}>Loading hotel details...</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={styles.datePickerContainer}>
        <div>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            style={styles.dateInput}
            required
            placeholder="Check-in Date"
          />
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split('T')[0]}
            style={styles.dateInput}
            required
            placeholder="Check-out Date"
          />
        </div>
        <button 
          style={{
            ...styles.button,
            opacity: checkIn && checkOut ? 1 : 0.6
          }}
          onClick={() => {
            if (checkIn && checkOut) {
              navigate(`/getavailablerooms/${hotelID}/${checkIn}/${checkOut}`);
            } else {
              alert('Please select both check-in and check-out dates');
            }
          }}
          disabled={!checkIn || !checkOut}
        >
          View Available Rooms
        </button>
    <div style={styles.container}>
      <h2 style={styles.header}>{hotel.name}</h2>
      
      <div style={styles.detailsContainer}>
        {[
          { label: "Location", value: hotel.location },
          { label: "Manager ID", value: hotel.managerID },
          { label: "Amenities", value: hotel.amenities },
          { label: "Rating", value: `${hotel.rating} ⭐` }
        ].map((detail, index) => (
          <div key={index} style={styles.detailRow}>
            <span style={styles.label}>{detail.label}</span>
            <span style={styles.value}>{detail.value}</span>
          </div>
        ))}
      </div>

      

        
      </div>
    </div>
  );
};

export default GetHotelsById;