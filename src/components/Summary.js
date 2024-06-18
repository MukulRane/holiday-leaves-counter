import React from 'react';

const Summary = ({ totalLeaves, totalHolidays, totalHours }) => {
  return (
    <div className="summary">
      <p>Total Leaves: {totalLeaves}</p>
      <p>Total Holidays: {totalHolidays}</p>
      <p>Total Hours: {totalHours.toFixed(2)}</p>
    </div>
  );
};

export default Summary;
