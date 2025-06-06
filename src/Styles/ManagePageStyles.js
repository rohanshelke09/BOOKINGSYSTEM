import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8fafc;
  min-height: 100vh;
`;

export const HeaderSection = styled.div`
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
  padding: 30px 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ContentCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
`;

export const Th = styled.th`
  text-align: left;
  padding: 16px;
  background: #f8fafc;
  color: #1e293b;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
  
  &:first-child {
    border-top-left-radius: 12px;
  }
  
  &:last-child {
    border-top-right-radius: 12px;
  }
`;

export const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
`;

export const Tr = styled.tr`
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
  }
`;

export const ActionButton = styled.button`
  background: ${props => {
    if (props.$variant === 'primary') return '#4f46e5';
    if (props.$variant === 'danger') return '#dc2626';
    return '#ffffff';
  }};
  color: ${props => props.$variant ? '#ffffff' : '#4f46e5'};
  border: 2px solid ${props => props.$variant === 'danger' ? '#dc2626' : '#4f46e5'};
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const SearchBar = styled.div`
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
  
  input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    outline: none;
    transition: all 0.2s;
    
    &:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #4f46e5;
  font-size: 1.2rem;
`;

export const Message = styled.div`
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  text-align: center;
  background: ${props => props.$type === 'error' ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.$type === 'error' ? '#dc2626' : '#059669'};
`;