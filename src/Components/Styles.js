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
    props.$variant === "edit" ? "#007bff" : "#dc3545"};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.$variant === "edit" ? "#0056b3" : "#c82333"};
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

export const PaymentContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
`;

export const PaymentCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

export const PaymentHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;

  h2 {
    color: #2c3e50;
    margin-bottom: 10px;
  }

  p {
    color: #6c757d;
  }
`;

export const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
`;

export const MethodButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border: 2px solid ${props => props.$selected ? '#007bff' : '#dee2e6'};
  border-radius: 10px;
  background: ${props => props.$selected ? '#f8f9fa' : 'white'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #007bff;
  }

  svg {
    font-size: 24px;
    color: #007bff;
  }
`;

export const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    color: #2c3e50;
    font-weight: 500;
  }

  input, select {
    padding: 12px;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    font-size: 16px;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
  }
`;

export const PaymentSummary = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;

  h3 {
    color: #2c3e50;
    margin-bottom: 15px;
  }

  .amount {
    font-size: 24px;
    color: #007bff;
    font-weight: bold;
  }
`;

export const PayButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  color: #dc3545;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 14px;
`;