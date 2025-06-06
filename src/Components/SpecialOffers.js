import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaClock, FaTag, FaPercent } from 'react-icons/fa';

const PageContainer = styled.div`
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center; 
  margin-bottom: 50px;

  h1 {
    color: #2c3e50;
    font-size: 2.5rem;
    margin-bottom: 15px;
  }

  p {
    color: #6c757d;
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const OffersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const OfferCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const OfferImage = styled.div`
  height: 200px;
  background-image: url(${props => props.$image});
  background-size: cover;
  background-position: center;
`;

const OfferContent = styled.div`
  padding: 20px;

  h3 {
    color: #2c3e50;
    margin: 0 0 15px 0;
    font-size: 1.5rem;
  }

  p {
    color: #6c757d;
    margin: 0 0 15px 0;
    line-height: 1.6;
  }
`;

const OfferMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  color: #007bff;
  font-size: 0.9rem;

  svg {
    margin-right: 5px;
  }
`;

const OfferPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;

  .price {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;

    .original {
      text-decoration: line-through;
      color: #6c757d;
      font-size: 1rem;
      margin-right: 10px;
    }
  }
`;

const BookButton = styled(motion.button)`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #0056b3;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #007bff;
  border-radius: 20px;
  background: ${props => props.$active ? '#007bff' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#007bff'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #007bff;
    color: white;
  }
`;

const SpecialOffers = () => {
  const [filter, setFilter] = useState('all');

  const offers = [
    {
      id: 1,
      title: 'Weekend Getaway Package',
      description: 'Enjoy a luxurious weekend stay with breakfast included and late checkout.',
      image: '/images/weekend-package.jpg',
      validUntil: '2025-12-31',
      discount: '20%',
      originalPrice: 299,
      discountedPrice: 239,
      category: 'weekend'
    },
    {
      id: 2,
      title: 'Summer Holiday Special',
      description: 'Book a 5-night stay and get 1 night free, plus complimentary spa access.',
      image: '/images/summer-special.jpg',
      validUntil: '2025-09-30',
      discount: '25%',
      originalPrice: 899,
      discountedPrice: 674,
      category: 'holiday'
    },
    {
      id: 3,
      title: 'Business Travel Package',
      description: 'Special rates for business travelers including workspace and breakfast.',
      image: '/images/business-package.jpg',
      validUntil: '2025-12-31',
      discount: '15%',
      originalPrice: 199,
      discountedPrice: 169,
      category: 'business'
    }
  ];

  const filteredOffers = filter === 'all' 
    ? offers 
    : offers.filter(offer => offer.category === filter);

  return (
    <PageContainer>
      <Header>
        <h1>Special Offers</h1>
        <p>Discover our exclusive deals and packages designed to make your stay extraordinary</p>
      </Header>

      <FilterBar>
        <FilterButton 
          $active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All Offers
        </FilterButton>
        <FilterButton 
          $active={filter === 'weekend'} 
          onClick={() => setFilter('weekend')}
        >
          Weekend Packages
        </FilterButton>
        <FilterButton 
          $active={filter === 'holiday'} 
          onClick={() => setFilter('holiday')}
        >
          Holiday Specials
        </FilterButton>
        <FilterButton 
          $active={filter === 'business'} 
          onClick={() => setFilter('business')}
        >
          Business Packages
        </FilterButton>
      </FilterBar>

      <OffersGrid>
        {filteredOffers.map(offer => (
          <OfferCard
            key={offer.id}
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OfferImage $image={offer.image} />
            <OfferContent>
              <h3>{offer.title}</h3>
              <OfferMeta>
                <span><FaClock /> Valid until {offer.validUntil}</span>
                <span><FaPercent /> {offer.discount} OFF</span>
              </OfferMeta>
              <p>{offer.description}</p>
              <OfferPrice>
                <div className="price">
                  <span className="original">${offer.originalPrice}</span>
                  ${offer.discountedPrice}
                </div>

              </OfferPrice>
            </OfferContent>
          </OfferCard>
        ))}
      </OffersGrid>
    </PageContainer>
  );
};

export default SpecialOffers;