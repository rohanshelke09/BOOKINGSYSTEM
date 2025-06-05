import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

export const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const TableHeader = styled.th`
  padding: 12px 15px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  &:hover {
    background-color: #f5f5f5;
  }
`;

export const TableCell = styled.td`
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
  vertical-align: middle;
`;

export const ActionButton2 = styled.button`
  padding: 8px 16px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: ${(props) =>
    props.variant === "edit" ? "#007bff" : "#dc3545"};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.variant === "edit" ? "#0056b3" : "#c82333"};
    transform: translateY(-1px);
  }
`;
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