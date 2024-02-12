import React, { createContext, useState } from 'react';

const AmortizationContext = createContext();

export const AmortizationProvider = ({ children }) => {
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);

  const updateAmortizationSchedule = (schedule) => {
    setAmortizationSchedule(schedule);
  };

  return (
    <AmortizationContext.Provider value={{ amortizationSchedule, updateAmortizationSchedule }}>
      {children}
    </AmortizationContext.Provider>
  );
};

export default AmortizationContext;
