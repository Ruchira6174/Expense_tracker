import React from 'react';

const SummaryCard = ({ title, amount, type }) => {
  // Optional: You can use the 'type' prop to style cards differently (e.g., green for income, red for expenses)
  return (
    <div className={`summary-card summary-card-${type}`}>
      <h3 className="summary-title">{title}</h3>
      <p className="summary-amount">
        ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  );
};

export default SummaryCard;
