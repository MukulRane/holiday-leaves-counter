import React from 'react';

const Header = ({ year, month, setYear, setMonth }) => {
  return (
    <div>
      <label>
        Year:
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {/* Generate year options dynamically */}
          {Array.from({ length: 10 }, (_, i) => 2024 + i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>
      <label>
        Month:
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default Header;
