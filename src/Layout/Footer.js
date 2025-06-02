import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background-color: #1a1a1a;
  color: #fff;
  padding: 60px 0 20px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 0 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: #fff;
    margin-bottom: 20px;
    font-size: 18px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 10px;
  }

  a {
    color: #9ca3af;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #fff;
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #333;
  color: #9ca3af;
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
        <p>&copy; {new Date().getFullYear()} Smart Hotel. All rights reserved.</p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;