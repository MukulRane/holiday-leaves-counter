import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Calendar from './components/Calendar';
import Summary from './components/Summary';
import './App.css';

const App = () => {
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(4); // May is month 4 (0-indexed)
  const [days, setDays] = useState([]);
  const [monthData, setMonthData] = useState({});

  useEffect(() => {
    const key = `${year}-${month}`;
    if (monthData[key]) {
      setDays(generateDays(year, parseInt(month), monthData));
    } else {
      const newDays = generateDays(year, parseInt(month), monthData);
      setMonthData((prevData) => ({ ...prevData, [key]: newDays }));
      setDays(newDays);
    }
  }, [year, month]);

  const generateDays = (year, month, existingData = {}) => {
    const daysArray = [];
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Adjust to make Monday as the first column (0 is Sunday)
    const startDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

    // Calculate the previous month and next month
    const prevMonth = month === 0 ? 11 : month - 1;
    const nextMonth = month === 11 ? 0 : month + 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const nextMonthYear = month === 11 ? year + 1 : year;

    // Previous month days
    const prevMonthLastDate = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
    for (let i = prevMonthLastDate - startDay + 1; i <= prevMonthLastDate; i++) {
      const date = new Date(prevMonthYear, prevMonth, i);
      const existingDay = findExistingDay(existingData, date);
      daysArray.push(existingDay || { name: date.toLocaleString('en-us', { weekday: 'short' }), date, status: '', hours: '' });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const existingDay = findExistingDay(existingData, date);
      daysArray.push(existingDay || { name: date.toLocaleString('en-us', { weekday: 'short' }), date, status: '', hours: '' });
    }

    // Fill the remaining cells with the next month's days if needed
    const totalCells = 35;
    let nextMonthDay = 1;
    while (daysArray.length < totalCells) {
      const date = new Date(nextMonthYear, nextMonth, nextMonthDay++);
      const existingDay = findExistingDay(existingData, date);
      daysArray.push(existingDay || { name: date.toLocaleString('en-us', { weekday: 'short' }), date, status: '', hours: '' });
    }

    // Ensure only 35 days are returned
    return daysArray.slice(0, totalCells);
  };

  const findExistingDay = (existingData, date) => {
    for (let key in existingData) {
      const day = existingData[key].find(day => day.date.getTime() === date.getTime());
      if (day) {
        return day;
      }
    }
    return null;
  };

  const updateStatus = (date, newStatus, newHours) => {
    const key = `${year}-${month}`;
    const updatedDays = days.map((day) => {
      if (day.date.getTime() === new Date(date).getTime()) {
        return { ...day, status: newStatus, hours: newHours };
      }
      return day;
    });

    setDays(updatedDays);
    setMonthData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[key] = updatedDays;
      // Update overlapping days in other months
      for (let k in updatedData) {
        updatedData[k] = updatedData[k].map((day) => {
          if (day.date.getTime() === new Date(date).getTime()) {
            return { ...day, status: newStatus, hours: newHours };
          }
          return day;
        });
      }
      return updatedData;
    });
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
