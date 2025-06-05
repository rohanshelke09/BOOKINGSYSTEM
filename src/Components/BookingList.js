import React from 'react';
import { FaCalendarCheck } from 'react-icons/fa';
import { Card, BookingCard, ActionButton } from './Styles';

const BookingList = ({ bookings, loading, onBookingClick, onViewAllClick }) => {
  if (loading) {
    return <p>Loading bookings...</p>;
  }

  return (
    <Card>      
      <h3><FaCalendarCheck /> Recent Bookings</h3>
      {bookings.length > 0 ? (
        bookings.slice(0, 5).map(booking => (
          <BookingCard 
          key={`booking-${booking.bookingID}`} // Fixed unique key using bookingID
          $status={booking.status}
            onClick={() => onBookingClick(booking.bookingID)}
          >
            <div className="booking-header">
              <strong>Room {booking.room.number}</strong>
              <span className="status">{booking.status}</span>
            </div>
            <p>Guest: {booking.user.name}</p>
            <p>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
          </BookingCard>
        ))
      ) : (
        <p>No recent bookings</p>
      )}
      <ActionButton $variant="outline" onClick={onViewAllClick}>
        View All Bookings
      </ActionButton>
    </Card>
  );
};

export default BookingList;