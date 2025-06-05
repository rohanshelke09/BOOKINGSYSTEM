import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Card = styled.div`
  background-color: ${props => props.$bgColor || '#fff'};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
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
  <Card $bgColor={bgColor}>
    <div className="text-center">
      <div className={`text-2xl font-bold text-${color}-600`}>{count}</div>
      <div className={`text-sm font-medium text-${color}-500`}>{title}</div>
    </div>
    {children}
  </Card>
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