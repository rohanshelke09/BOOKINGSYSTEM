import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  h2 {
    margin-bottom: 16px;
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
  }

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 16px;
  }
`;

export const PageContainer = styled.div`
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Title = styled.h1`
  color: #1f2937;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
`;

export const ContentCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  color: #4b5563;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
`;

export const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
`;

export const Tr = styled.tr`
  &:hover {
    background-color: #f8fafc;
  }
`;

export const ActionButton = styled.button`
  background: ${props => props.$primary ? '#4f46e5' : '#ffffff'};
  color: ${props => props.$primary ? '#ffffff' : '#4f46e5'};
  border: 2px solid #4f46e5;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(79, 70, 229, 0.1);
    background: ${props => props.$primary ? '#4338ca' : '#f5f3ff'};
  }

  ${props => props.$variant === 'danger' && `
    background: #ffffff;
    color: #dc2626;
    border-color: #dc2626;
    
    &:hover {
      background: #fef2f2;
    }
  `}
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #6b7280;
  font-size: 1.1rem;
`;

export const Message = styled.div`
  padding: 16px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
  
  ${props => props.$type === 'error' && `
    background-color: #fee2e2;
    color: #dc2626;
  `}
  
  ${props => props.$type === 'success' && `
    background-color: #ecfdf5;
    color: #059669;
  `}
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;

export const Select = styled.select`
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;