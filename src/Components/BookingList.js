import React from 'react';
import { FaCalendarCheck } from 'react-icons/fa';
import { Card, BookingCard, ActionButton } from './Styles';
import { useNavigate } from 'react-router-dom';

const BookingList = ({ bookings, loading, onBookingClick,  }) => {
  const Navigate = useNavigate();
  if (loading) {
    return <p>Loading bookings...</p>;
  }
  const onViewAllClick = () => {
    Navigate('/bookings');
  };

  // Filter bookings within last 2 days
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const recentBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.checkInDate);
    return bookingDate >= twoDaysAgo;
  });

  // Sort bookings by date (most recent first)
  const sortedBookings = recentBookings.sort((a, b) => 
    new Date(b.checkInDate) - new Date(a.checkInDate)
  );

  return (
    <Card>      
      <h3><FaCalendarCheck /> Recent Bookings</h3>
      {sortedBookings.length > 0 ? (
        <>
          {/* Show only first 2 bookings */}
          {sortedBookings.slice(0, 2).map(booking => (
            <BookingCard 
              key={`booking-${booking.bookingID}`}
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
          ))}
          
          {/* Show view all button only if there are more bookings */}
          {sortedBookings.length > 2 && (
            <ActionButton 
              $variant="outline" 
              onClick={onViewAllClick}
            >
              View All Bookings ({sortedBookings.length - 2} more)
            </ActionButton>
          )}
        </>
      ) : (
        <p>No recent bookings in the last 2 days</p>
      )}
    </Card>
  );
};

export default BookingList;