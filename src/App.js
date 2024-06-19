import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Calendar from './components/Calendar';
import Summary from './components/Summary';
import './App.css';

const App = () => {
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(5); // May is month 5 (0-indexed)
  const [days, setDays] = useState([]);

  useEffect(() => {
    const newDays = generateDays(year, parseInt(month));
    setDays(newDays);
  }, [year, month]);

  const generateDays = (year, month) => {
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
      const storedDay = JSON.parse(localStorage.getItem(date.toString())) || { name: date.toLocaleString('en-us', { weekday: 'short' }), date: date.toString(), status: '', hours: '' };
      daysArray.push(storedDay);
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const storedDay = JSON.parse(localStorage.getItem(date.toString())) || { name: date.toLocaleString('en-us', { weekday: 'short' }), date: date.toString(), status: '', hours: '' };
      daysArray.push(storedDay);
    }

    // Fill the remaining cells with the next month's days if needed
    const totalCells = 40;
    let nextMonthDay = 1;
    while (daysArray.length < totalCells) {
      const date = new Date(nextMonthYear, nextMonth, nextMonthDay++);
      const storedDay = JSON.parse(localStorage.getItem(date.toString())) || { name: date.toLocaleString('en-us', { weekday: 'short' }), date: date.toString(), status: '', hours: '' };
      daysArray.push(storedDay);
    }

    return daysArray;
  };

  const updateStatus = (date, newStatus, newHours) => {
    console.log(`Updating status for ${date}: status=${newStatus}, hours=${newHours}`);
    const updatedDays = days.map((day) => {
      if (day.date && new Date(day.date).getTime() === new Date(date).getTime()) {
        return { ...day, status: newStatus, hours: newHours };
      }
      return day;
    });

    setDays(updatedDays);
    localStorage.setItem(date, JSON.stringify({ date, status: newStatus, hours: newHours }));
    console.log('Data updated in localStorage:', JSON.parse(localStorage.getItem(date)));
  };

  const calculateTotalLeaves = () => {
    return days.reduce((total, day) => (day.status === 'L' ? total + 1 : total), 0);
  };

  const calculateTotalHolidays = () => {
    return days.reduce((total, day) => (day.status === 'H' ? total + 1 : total), 0);
  };

  const calculateTotalHours = () => {
    return days.reduce((total, day) => {
      if (!isNaN(parseFloat(day.hours)) && day.name !== 'Total Hours') {
        return total + parseFloat(day.hours);
      }
      return total;
    }, 0);
  };

  const renderDaysWithTotals = () => {
    const daysWithTotals = [];
    for (let i = 0; i < days.length; i++) {
      daysWithTotals.push(days[i]);
      if ((i + 1) % 7 === 0 && daysWithTotals.length <= 40) {
        daysWithTotals.push({ name: 'Total Hours', date: null, status: '', hours: calculateWeekHours(days, i - 6, i + 1) });
      }
    }
    return daysWithTotals.slice(0, 40);
  };

  const calculateWeekHours = (daysArray, start, end) => {
    const weekDays = daysArray.slice(start, end);
    const totalHours = weekDays.reduce((sum, day) => {
      const hours = parseFloat(day.hours) || 0;
      return sum + hours;
    }, 0);
    return totalHours.toFixed(2);
  };

  return (
    <div className="App">
      <Header year={year} month={month} setYear={setYear} setMonth={setMonth} />
      <div className="container">
        <div className="summary-container">
          <Summary
            totalLeaves={calculateTotalLeaves()}
            totalHolidays={calculateTotalHolidays()}
            totalHours={calculateTotalHours()}
          />
        </div>
        <div className="calendar-container">
          <Calendar days={renderDaysWithTotals()} updateStatus={updateStatus} />
        </div>
      </div>
    </div>
  );
};

export default App;
