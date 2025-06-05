import styled from 'styled-components';

export const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
  }

  .icon {
    font-size: 2rem;
    color: ${props => props.iconColor};
    margin-bottom: 1rem;
  }

  .label {
    color: #6c757d;
    font-size: 0.9rem;
  }

  .value {
    font-size: 1.8rem;
    font-weight: bold;
    color: #2d3436;
    margin: 0.5rem 0;
  }
`;

export const BookingCard = styled.div`
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  background: #f8f9fa;
  cursor: pointer;
  
  &:hover {
    background: #e9ecef;
  }
`;

export const ActionButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: ${props => props.$variant === 'outline' ? '1px solid #2193b0' : 'none'};
  background: ${props => props.$variant === 'outline' ? 'transparent' : '#2193b0'};
  color: ${props => props.$variant === 'outline' ? '#2193b0' : 'white'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$variant === 'outline' ? '#e3f2fd' : '#1c7d98'};
  }
`;