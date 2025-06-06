import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
`;

const TopBar = styled.div`
  background-color: #1a1a1a;
  color: #fff;
  padding: 8px 0;
  font-size: 14px;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  text-decoration: none;
  color: #2c3e50;
  font-size: 24px;
  font-weight: bold;

  &:hover {
    color: #007bff;
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
  color: #2c3e50;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f8f9fa;
    color: #007bff;
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
  color: #2c3e50;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  border: 1px solid #007bff;

  &:hover {
    background-color: #007bff;
    color: white;
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
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #dc3545;
    color: white;
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
      <TopBar>
        <TopBarContent>
          <a href="tel:+12345678900">
            <FaPhone /> +1 234 567 8900
          </a>
          <a href="mailto:info@smarthotel.com">
            <FaEnvelope /> info@smarthotel.com
          </a>
        </TopBarContent>
      </TopBar>
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