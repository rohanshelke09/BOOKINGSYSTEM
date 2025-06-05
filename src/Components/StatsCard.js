import React from 'react';
import { Card } from './Styles';

const StatsCard = ({ icon: Icon, label, value, color }) => (
  <Card $iconColor={color}>
    <Icon className="icon" />
    <div className="label">{label}</div>
    <div className="value">{value}</div>
  </Card>
);

export default StatsCard;