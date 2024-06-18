import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Calendar from './components/Calendar';
import Summary from './components/Summary';
import './App.css';

const App = () => {
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(6);
  const [days, setDays] = useState([]);

  useEffect(() => {
    generateDays(year, month);
  }, [year, month]);

  const generateDays = (year, month) => {
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = [];

    let prevMonthDays = firstDayOfMonth !== 1 ? new Date(year, month - 1, 0).getDate() - (firstDayOfMonth - 2) : 0;

    for (let i = 0; i < 35; i++) {
      const date = i < firstDayOfMonth ? prevMonthDays++ : i - firstDayOfMonth + 1;
      const day = new Date(year, month - 1, date).toLocaleString('en-us', { weekday: 'short' });
      daysArray.push({ name: day, date, status: '', hours: '' });
    }

    setDays(daysArray);
  };

  const updateStatus = (date, newStatus, newHours) => {
    setDays((prevDays) =>
      prevDays.map((day) => {
        if (day.date === date) {
          return { ...day, status: newStatus, hours: newHours };
        }
        return day;
      })
    );
  };

  const calculateTotalLeaves = () => {
    return days.reduce((total, day) => (day.status === 'L' ? total + 1 : total), 0);
  };

  const calculateTotalHolidays = () => {
    return days.reduce((total, day) => (day.status === 'H' ? total + 1 : total), 0);
  };

  const calculateTotalHours = () => {
    return days.reduce((total, day) => {
      if (!isNaN(parseFloat(day.hours))) {
        return total + parseFloat(day.hours);
      }
      return total;
    }, 0);
  };

  return (
    <div className="App">
      <Header year={year} month={month} setYear={setYear} setMonth={setMonth} />
      <Calendar days={days} updateStatus={updateStatus} />
      <Summary
        totalLeaves={calculateTotalLeaves()}
        totalHolidays={calculateTotalHolidays()}
        totalHours={calculateTotalHours()}
      />
    </div>
  );
};

export default App;
