import React, { useState, useEffect } from 'react';
import './Day.css';

const Day = ({ day, updateStatus }) => {
  const [status, setStatus] = useState(day.status);
  const [inputValue, setInputValue] = useState(day.hours || '');

  useEffect(() => {
    setStatus(day.status);
    if (day.status === '') {
      setInputValue(day.hours || '');
    }
  }, [day.status, day.hours]);

  const handleStatus = (type) => {
    const newStatus = status === type ? '' : type;
    setStatus(newStatus);
    const newHours = newStatus === '' ? inputValue : '0';
    setInputValue(newHours);
    updateStatus(day.date, newStatus, newHours);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && status) {
      setStatus('');
      setInputValue('');
      updateStatus(day.date, '', '');
    }
  };

  const handleChange = (e) => {
    const newHours = e.target.value;
    setInputValue(newHours);
    if (!status) {
      updateStatus(day.date, status, newHours);
    }
  };

  const handleBlurOrEnter = (e) => {
    if (e.type === 'blur' || (e.type === 'keypress' && e.key === 'Enter')) {
      updateStatus(day.date, status, inputValue);
    }
  };

  const formatDateHeader = () => {
    if (day.name === 'Total Hours') {
      return 'Total Hours';
    }
    const date = new Date(day.date);
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const isWeekend = () => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  return (
    <div className="day">
      <div className="day-header" style={{ backgroundColor: 'lightgrey', fontWeight: 'bold' }}>
        {formatDateHeader()}
      </div>
      <div className="day-body" style={{ backgroundColor: 'white' }}>
        <div className="input-wrapper">
          {day.name === 'Total Hours' ? (
            <div className="total-hours">{day.hours || '0.00'}</div>
          ) : (
            <>
              <input
                type="text"
                value={status === 'L' ? 'LEAVE' : status === 'H' ? 'HOLIDAY' : inputValue}
                placeholder="0.00"
                readOnly={status !== ''}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                onBlur={handleBlurOrEnter}
                onKeyPress={handleBlurOrEnter}
                style={{ borderColor: 'grey' }}
              />
              {!isWeekend() && status === '' && (
                <>
                  <button onClick={() => handleStatus('L')} className="status-btn">L</button>
                  <button onClick={() => handleStatus('H')} className="status-btn">H</button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Day;
