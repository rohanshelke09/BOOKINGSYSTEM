import React from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import styled from 'styled-components';

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
`;

const TopBarContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
`;

const MainHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
`;

const NavMenu = styled.nav`
  display: flex;
  gap: 30px;
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
`;

const BookNowButton = styled(Link)`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;
const AuthButtons = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
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
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
`;

const Header = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/');
    };

  return (
    <HeaderContainer>
      <TopBar>
        <TopBarContent>
          <div>📞 +1 234 567 8900</div>
          <div>✉️ info@smarthotel.com</div>
        </TopBarContent>
      </TopBar>
      <MainHeader>
        <Logo>Smart Hotel</Logo>
        <NavMenu>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {userRole ? (
            <>
              <NavLink to={`/${userRole}-dashboard`}>Dashboard</NavLink>
              <UserInfo>
                <span>Welcome, {userRole}</span>
                <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
              </UserInfo>
            </>
          ) : (
            <AuthButtons>
              <AuthLink to="/login">Login</AuthLink>
              <AuthLink to="/register">Register</AuthLink>
             
            </AuthButtons>
          )}
        </NavMenu>
      </MainHeader>
    </HeaderContainer>
  );
};

export default Header;