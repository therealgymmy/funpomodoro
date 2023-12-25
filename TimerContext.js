import React, { createContext, useContext, useState } from 'react';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const [workInterval, setWorkInterval] = useState(25); // Default work interval in minutes
  const [restInterval, setRestInterval] = useState(5);  // Default rest interval in minutes

  return (
    <TimerContext.Provider value={{ workInterval, setWorkInterval, restInterval, setRestInterval }}>
      {children}
    </TimerContext.Provider>
  );
};