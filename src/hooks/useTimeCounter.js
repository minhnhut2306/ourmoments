/* eslint-disable no-undef */


function useTimeCounter(initialDays = 1083) {
  const { useState } = require('react');
  const [days] = useState(initialDays);
  const [timeMode, setTimeMode] = useState(0);

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
export default { useTimeCounter };