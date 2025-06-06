import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaStar, FaHotel, FaConciergeBell, FaUsers } from 'react-icons/fa';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled.div`
  position: relative;
  height: 500px;
  background: url('/Images/726824.jpg') center/cover;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 60px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }
`;

const HeroContent = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 20px;

  h1 {
    font-size: 3rem;
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.2rem;
    max-width: 600px;
    line-height: 1.6;
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin: 60px 0;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;

  svg {
    font-size: 2.5rem;
    color: #007bff;
    margin-bottom: 15px;
  }

  h3 {
    font-size: 2rem;
    color: #2c3e50;
    margin: 10px 0;
  }

  p {
    color: #6c757d;
    font-size: 1.1rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin: 60px 0;
`;

const FeatureCard = styled(motion.div)`
  position: relative;
  height: 400px;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  }
`;

const FeatureContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  color: white;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 1rem;
    opacity: 0.9;
  }
`;

const About = () => {
  return (
    <PageContainer>
      <ContentWrapper>
        <HeroSection>
          <HeroContent>
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Welcome to Smart Hotel
            </motion.h1>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Experience luxury and comfort in the heart of the city. 
              Our commitment to excellence ensures your stay is nothing short of extraordinary.
            </motion.p>
          </HeroContent>
        </HeroSection>

        <StatsSection>
          <StatCard
            whileHover={{ y: -10 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FaHotel />
            <h3>150+</h3>
            <p>Luxury Rooms</p>
          </StatCard>

          <StatCard
            whileHover={{ y: -10 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FaUsers />
            <h3>10,000+</h3>
            <p>Happy Guests</p>
          </StatCard>

          <StatCard
            whileHover={{ y: -10 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FaStar />
            <h3>4.8/5</h3>
            <p>Guest Rating</p>
          </StatCard>

          <StatCard
            whileHover={{ y: -10 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <FaConciergeBell />
            <h3>24/7</h3>
            <p>Service Available</p>
          </StatCard>
        </StatsSection>

        <FeaturesGrid>
          <FeatureCard
            whileHover={{ y: -10 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img src="/Images/726862.jpg" alt="Luxury Suite" />
            <FeatureContent>
              <h3>Luxury Suites</h3>
              <p>Experience ultimate comfort in our premium suites</p>
            </FeatureContent>
          </FeatureCard>

          <FeatureCard
            whileHover={{ y: -10 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img src="/Images/726872.jpg" alt="Fine Dining" />
            <FeatureContent>
              <h3>Fine Dining</h3>
              <p>Savor exquisite cuisine at our restaurants</p>
            </FeatureContent>
          </FeatureCard>

          <FeatureCard
            whileHover={{ y: -10 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <img src="/Images/726880.jpg" alt="Wellness Center" />
            <FeatureContent>
              <h3>Wellness Center</h3>
              <p>Rejuvenate your body and mind at our spa</p>
            </FeatureContent>
          </FeatureCard>
        </FeaturesGrid>
      </ContentWrapper>
    </PageContainer>
  );
};

export default About;