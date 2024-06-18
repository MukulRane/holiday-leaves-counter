import React from 'react';
import Day from './Day';

const Calendar = ({ days, updateStatus }) => {
  return (
    <div className="calendar">
      {days.map((day, index) => (
        <Day key={index} day={day} updateStatus={updateStatus} />
      ))}
    </div>
  );
};

export default Calendar;
