import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Value = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.color};
  margin: 0.5rem 0;
  
  ${props => props.isPercentage && `
    display: flex;
    align-items: baseline;
    
    &::after {
      content: '%';
      font-size: 1.2rem;
      margin-left: 2px;
      opacity: 0.8;
    }
  `}
`;

const StatsCard = ({ icon: Icon, label, value, color, isPercentage }) => {
  return (
    <Card>
      <Icon size={24} color={color} />
      <Value color={color} isPercentage={isPercentage}>
        {value}
      </Value>
      <div>{label}</div>
    </Card>
  );
};

export default StatsCard;