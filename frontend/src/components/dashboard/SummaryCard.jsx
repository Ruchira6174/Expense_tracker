import React from 'react';
import { formatCurrency } from '../../utils/helpers';

const SummaryCard = ({ title, amount, type }) => {
  return (
    <div className={`summary-card summary-card-${type}`}>
      <h3 className="summary-title">{title}</h3>
      <p className="summary-amount">{formatCurrency(amount)}</p>
    </div>
  );
};

export default SummaryCard;
