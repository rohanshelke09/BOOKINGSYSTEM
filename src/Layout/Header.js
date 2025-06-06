import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
`;

const TopBar = styled.div`
  background-color: #1e40af; // Tailwind blue-800
  color: #ffffff;
  padding: 0.5rem 0;
  font-size: 0.875rem;
`;

const TopBarContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  gap: 10px;

  a {
    color: #fff;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 5px;

    &:hover {
      color: #007bff;
    }
  }
`;

const MainHeader = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
`;

const Logo = styled(Link)`
  text-decoration: none;
  color: #1e40af; // Tailwind blue-800
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  
  &:hover {
    color: #2563eb; // Tailwind blue-600
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #2c3e50;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavMenu = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #1f2937; // Tailwind gray-800
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6; // Tailwind gray-100
    color: #1e40af; // Tailwind blue-800
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const AuthLink = styled(Link)`
  text-decoration: none;
  color: #ffffff;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  background-color: #1e40af; // Tailwind blue-800

  &:hover {
    background-color: #1d4ed8; // Tailwind blue-700
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }

  span {
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;

const LogoutButton = styled.button`
  background-color: #ef4444; // Tailwind red-500
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #dc2626; // Tailwind red-600
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <MainHeader>
        <Logo to="/">Smart Hotel</Logo>
        <MenuButton onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </MenuButton>
        <NavMenu $isOpen={isMenuOpen}>
          <NavLink to="/" onClick={handleNavClick}>Home</NavLink>
          <NavLink to="/about" onClick={handleNavClick}>About</NavLink>
          <NavLink to="/contact" onClick={handleNavClick}>Contact</NavLink>
          {userRole ? (
            <>
              <NavLink to={`/${userRole}-dashboard`} onClick={handleNavClick}>
                Dashboard
              </NavLink>
              <UserInfo>
                <span>
                  <FaUser /> Welcome, {userRole}
                </span>
                <LogoutButton onClick={handleLogout}>
                  Logout
                </LogoutButton>
              </UserInfo>
            </>
          ) : (
            <AuthButtons>
              <AuthLink to="/login" onClick={handleNavClick}>
                Login
              </AuthLink>
              <AuthLink to="/register" onClick={handleNavClick}>
                Register
              </AuthLink>
            </AuthButtons>
          )}
        </NavMenu>
      </MainHeader>
    </HeaderContainer>
  );
};

export default Header;