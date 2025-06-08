import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  h2 {
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 15px;
  }

  .count {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${props => props.color || '#4f46e5'};
    margin-bottom: 20px;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const DashboardCard = ({ 
  title, 
  count, 
  color, 
  bgColor, 
  onManage, 
  children 
}) => (
  <StyledCard color={color}>
    <div className="text-center">
      <div className="count">{count}</div>
      <h2>{title}</h2>
    </div>
    {children}
  </StyledCard>
);

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  bgColor: PropTypes.string,
  onManage: PropTypes.func,
  children: PropTypes.node
};

export default DashboardCard;