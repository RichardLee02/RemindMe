import { createContext, useContext, useState } from 'react';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [eventsCross, setEventsCross] = useState([]);

  const updateEventsCross = (newEventsCross) => {
    setEventsCross(newEventsCross);
    localStorage.setItem("eventsCross", JSON.stringify(newEventsCross));
  };

  return (
    <EventContext.Provider value={{ eventsCross, updateEventsCross }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  return useContext(EventContext);
};