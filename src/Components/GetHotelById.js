import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import GetHotelReviews from "./GetHotelReviews";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("/Images/362619.jpg");
  background-size: cover;
  background-attachment: fixed;
  padding: 40px 20px;
`;

const HotelContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const HotelHeader = styled.div`
  position: relative;
  height: 300px;
  background: ${(props) => `url(${props.$imageSrc})`};
  background-size: cover;
  background-position: center;
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7));
  }
`;

const HotelName = styled.h1`
  position: relative;
  font-size: 2.5rem;
  margin: 0;
  z-index: 1;
`;

const HotelRating = styled.div`
  position: relative;
  font-size: 1.2rem;
  z-index: 1;
  margin-top: 10px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  padding: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #34495e;
  width: 120px;
`;

const DetailValue = styled.span`
  color: #2c3e50;
`;

const BookingSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const DateInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const BookButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const MapContainer = styled.div`
  height: 300px;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 20px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  margin: 20px auto;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const WarningMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const ReviewsSection = styled.div`
  grid-column: 1 / -1;
  margin-top: 30px;
`;

const HotelDetailsCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const HotelName2 = styled.h1`
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 2.5rem;
  text-align: center;
`;

const HotelInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #34495e;

  svg {
    width: 20px;
    height: 20px;
    color: #007bff;
  }
`;

const GetHotelsById = ({
  isEmbedded = false,
  embeddedCheckIn = "",
  embeddedCheckOut = "",
}) => {
  const { hotelID } = useParams();
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const navigate = useNavigate();

  const getRandomImage = () => {
    const images = [
      "/Images/1390015.jpg",
      "/Images/362619.jpg",
      "/Images/366875.jpg",
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  // Add this function after state declarations
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return maxDate.toISOString().split("T")[0];
  };

  // Add this validation function after getMaxDate()
  const validateDates = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return true;
    return new Date(checkOut) > new Date(checkIn);
  };

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7125/api/Hotels/${hotelID}`
        );
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
    return (
      <PageContainer>
        <HotelContainer>
          <div style={{ padding: 20, color: "#dc3545" }}>{error}</div>
        </HotelContainer>
      </PageContainer>
    );
  }

  if (!hotel) {
    return (
      <PageContainer>
        <HotelContainer>
          <LoadingSpinner />
          <p style={{ textAlign: "center", color: "#666" }}>
            Loading hotel details...
          </p>
        </HotelContainer>
      </PageContainer>
    );
  }

  return isEmbedded ? (
    <HotelDetailsCard>
      <HotelName>{hotel.name}</HotelName>
      <HotelInfo>
        <InfoItem>
          <span>📍</span>
          <span>{hotel.location}</span>
        </InfoItem>
        <InfoItem>
          <span>⭐</span>
          <span>{hotel.rating} Rating</span>
        </InfoItem>
        <InfoItem>
          <span>📅</span>
          <span>
            {new Date(embeddedCheckIn).toLocaleDateString()} -{" "}
            {new Date(embeddedCheckOut).toLocaleDateString()}
          </span>
        </InfoItem>
      </HotelInfo>
    </HotelDetailsCard>
  ) : (
    <PageContainer>
      <HotelContainer>
        <HotelHeader $imageSrc={getRandomImage()}>
          <HotelName>{hotel.name}</HotelName>
          <HotelRating>{hotel.rating} ⭐</HotelRating>
        </HotelHeader>

        <ContentGrid>
          <DetailsList>
            <DetailItem>
              <DetailLabel>Location:</DetailLabel>
              <DetailValue>{hotel.location}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Amenities:</DetailLabel>
              <DetailValue>{hotel.amenities}</DetailValue>
            </DetailItem>
            <MapContainer>
              <iframe
                title="Hotel Location"
                width="100%"
                height="100%"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  hotel.location
                )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              />
            </MapContainer>
          </DetailsList>

          {/* Update the BookingSection JSX */}
          <BookingSection>
            <h3 style={{ marginBottom: 20 }}>Book Your Stay</h3>
            <DateInput
              type="date"
              value={checkIn}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                const maxDate = new Date(getMaxDate());
                if (selectedDate <= maxDate) {
                  setCheckIn(e.target.value);
                  // Clear checkout if it's before new checkin
                  if (checkOut && new Date(checkOut) <= selectedDate) {
                    setCheckOut("");
                  }
                }
              }}
              min={new Date().toISOString().split("T")[0]}
              max={getMaxDate()}
              required
              placeholder="Check-in Date"
            />
            {checkIn && new Date(checkIn) > new Date(getMaxDate()) && (
              <WarningMessage>
                Check-in date cannot be more than 1 year from today
              </WarningMessage>
            )}
            <DateInput
              type="date"
              value={checkOut}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                const maxDate = new Date(getMaxDate());
                if (selectedDate <= maxDate) {
                  setCheckOut(e.target.value);
                }
              }}
              min={checkIn || new Date().toISOString().split("T")[0]}
              max={getMaxDate()}
              required
              placeholder="Check-out Date"
            />
            {checkOut && new Date(checkOut) <= new Date(checkIn) && (
              <WarningMessage>
                Check-out date must be after check-in date
              </WarningMessage>
            )}
            {checkOut && new Date(checkOut) > new Date(getMaxDate()) && (
              <WarningMessage>
                Check-out date cannot be more than 1 year from today
              </WarningMessage>
            )}
            <BookButton
              onClick={() => {
                if (checkIn && checkOut && validateDates(checkIn, checkOut)) {
                  navigate(
                    `/available-rooms/${hotelID}/${checkIn}/${checkOut}`
                  );
                }
              }}
              disabled={
                !checkIn || !checkOut || !validateDates(checkIn, checkOut)
              }
            >
              View Available Rooms
            </BookButton>
          </BookingSection>
          <ReviewsSection>
            <GetHotelReviews hotelID={hotelID} />
          </ReviewsSection>
        </ContentGrid>
      </HotelContainer>
    </PageContainer>
  );
};

export default GetHotelsById;
