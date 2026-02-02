import { useState, useEffect } from 'react';

function useTimeCounter() {
  const startDate = new Date('2023-01-24'); 
  
  const calculateDays = () => {
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const [days, setDays] = useState(calculateDays());
  const [timeMode, setTimeMode] = useState(0);

  // Cập nhật mỗi ngày
  useEffect(() => {
    const interval = setInterval(() => {
      setDays(calculateDays());
    }, 1000 * 60 * 60); // Cập nhật mỗi giờ

    return () => clearInterval(interval);
  }, []);

  const totalYears = Math.floor(days / 365);
  const remainingDaysAfterYears = days % 365;
  const monthsAfterYears = Math.floor(remainingDaysAfterYears / 30);
  const totalMonths = Math.floor(days / 30);
  const totalWeeks = Math.floor(days / 7);
  const totalHours = days * 24;

  const handleTimeClick = () => {
    setTimeMode((prev) => (prev + 1) % 5);
  };

  const getTimeDisplay = () => {
    switch(timeMode) {
      case 0: 
        return { value: days, unit: 'ngày' };
      case 1: 
        if (totalYears === 0) {
          return { value: totalMonths, unit: 'tháng' };
        }
        return { value: `${totalYears} năm ${monthsAfterYears}`, unit: 'tháng' };
      case 2: 
        return { value: totalMonths, unit: 'tháng' };
      case 3: 
        return { value: totalWeeks, unit: 'tuần' };
      case 4: 
        return { value: totalHours.toLocaleString(), unit: 'giờ' };
      default: 
        return { value: days, unit: 'ngày' };
    }
  };

  return { timeDisplay: getTimeDisplay(), handleTimeClick };
}

export { useTimeCounter };