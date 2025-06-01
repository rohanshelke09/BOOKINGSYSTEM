import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ hotels, loading, error }) => {
    if (loading) {
        return <div className="text-center mt-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-4 text-danger">{error}</div>;
    }

    if (!hotels?.length) {
        return <div className="text-center mt-4">No hotels found matching your criteria.</div>;
    }

    return (
        <div className="row g-4 mt-2">
            {hotels.map((hotel) => (
                <div key={hotel.hotelID} className="col-md-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">{hotel.name}</h5>
                            <p className="card-text">
                                <strong>Location:</strong> {hotel.location}<br />
                                <strong>Rating:</strong> {hotel.rating} ⭐<br />
                                <strong>Amenities:</strong> {hotel.amenities}
                            </p>
                            <Link 
                                to={`/gethotelbyid/${hotel.hotelID}`}
                                className="btn btn-primary w-100"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SearchResults;