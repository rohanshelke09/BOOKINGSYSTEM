import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background-color: #1e40af; // Tailwind blue-800
  color: #ffffff;
  padding: 4rem 0 1.5rem;
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem;
  padding: 0 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: #ffffff;
    margin-bottom: 1.25rem;
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: 0.025em;
  }

  p {
    color: #e5e7eb; // Tailwind gray-200
    line-height: 1.625;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.75rem;
    color: #e5e7eb; // Tailwind gray-200
  }

  a {
    color: #e5e7eb; // Tailwind gray-200
    text-decoration: none;
    transition: color 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      color: #ffffff;
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #e5e7eb; // Tailwind gray-200
  font-size: 0.875rem;
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>About Us</h3>
          <p>Smart Hotel offers luxury accommodations with world-class amenities and exceptional service.</p>
        </FooterSection>

        <FooterSection>
          <h3>Contact</h3>
          <ul>
            <li>123 Hotel Street</li>
            <li>City, State 12345</li>
            <li>Phone: +1 234 567 8900</li>
            <li>Email: info@smarthotel.com</li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Follow Us</h3>
          <ul>
            <li><a href="https://facebook.com">Facebook</a></li>
            <li><a href="https://twitter.com">Twitter</a></li>
            <li><a href="https://instagram.com">Instagram</a></li>
            <li><a href="https://linkedin.com">LinkedIn</a></li>
          </ul>
        </FooterSection>
        
        <FooterSection>
          <h1>Happy Stay</h1>

        </FooterSection>
      </FooterContent>

      <Copyright>
        <p>&copy;2025 Smart Hotel. All rights reserved.</p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;