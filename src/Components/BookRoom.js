import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const FormInput = ({ label, type, value, onChange, min, disabled, error }) => (
    <div style={{ marginBottom: '20px' }}>
        <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '500',
            color: '#333'
        }}>
            {label}
        </label>
        <input
            type={type}
            value={value || ""}
            onChange={onChange}
            min={min}
            disabled={disabled}
            required={!disabled}
            style={{
                width: '100%',
                padding: '12px',
                backgroundColor: disabled ? '#f5f5f5' : 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
            }}
        />
        {error && (
            <span style={{ 
                color: '#dc3545',
                fontSize: '12px',
                marginTop: '4px',
                display: 'block'
            }}>
                {error}
            </span>
        )}
    </div>
);

const BookRoom = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomID } = useParams();
    const { price } = location.state || {};

    const [formData, setFormData] = useState({
        roomID: roomID || "",
        userID: "",
        checkInDate: location.state?.checkIn || "",
        checkOutDate: location.state?.checkOut || ""
    });
    const [errorMessage, setErrorMessage] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

   

    useEffect(() => {
        const validateSession = () => {
            const tokenObj = localStorage.getItem('token');
            if (!tokenObj) {
                navigate('/login', { state: { from: location.pathname } });
                return;
            }

            try {
                const decodedToken = jwtDecode(JSON.parse(tokenObj).token);
                const userId = decodedToken.nameid?.[0];
                
                if (!userId) {
                    throw new Error('User ID not found in token');
                }

                setFormData(prev => ({
                    ...prev,
                    userID: userId
                }));
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        validateSession();
    }, [navigate, location.pathname]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
       

        setLoading(true);
        try {
            const tokenObj = JSON.parse(localStorage.getItem('token'));
            if (!tokenObj?.token) throw new Error('No authentication token found');

            const response = await axios.post(
                `http://localhost:5217/api/Bookings/${roomID}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${tokenObj.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const { bookingID } = response.data;
            navigate('/payment', { 
                state: { 
                    price, 
                    bookingID,
                    checkIn: formData.checkInDate,
                    checkOut: formData.checkOutDate
                } 
            });
        } catch (error) {
            console.error("Error Booking Room:", error);
            setMessage("Error Booking Room: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            maxWidth: "600px", 
            margin: "40px auto", 
            padding: "30px",
            backgroundColor: "white", 
            borderRadius: "8px", 
            boxShadow: "0 2px 15px rgba(0,0,0,0.1)"
        }}>
            <h2 style={{ 
                textAlign: "center",
                color: "#333",
                marginBottom: "30px"
            }}>
                Book Room
            </h2>
            
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="User ID"
                    type="text"
                    value={formData.userID}
                    disabled={true}
                />
                
                <FormInput
                    label="Check-in Date"
                    type="date"
                    value={formData.checkInDate}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        checkInDate: e.target.value
                    }))}
                    min={new Date().toISOString().split('T')[0]}
                    error={errorMessage.checkInDate}
                />
                
                <FormInput
                    label="Check-out Date"
                    type="date"
                    value={formData.checkOutDate}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        checkOutDate: e.target.value
                    }))}
                    min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                    error={errorMessage.checkOutDate}
                />

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: loading ? "#ccc" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: '16px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s ease'
                    }}
                >
                    {loading ? "Booking..." : "Book Room"}
                </button>
            </form>

            {message && (
                <div style={{
                    marginTop: "20px",
                    padding: "15px",
                    borderRadius: "4px",
                    backgroundColor: message.includes("Error") ? "#ffe6e6" : "#e6ffe6",
                    color: message.includes("Error") ? "#dc3545" : "#28a745",
                    fontSize: '14px'
                }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default BookRoom;