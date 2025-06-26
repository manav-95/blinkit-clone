import React, { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";


// define context type
interface LocationContextType {
  openLocationBox: boolean;
  setOpenLocationBox: Dispatch<SetStateAction<boolean>>;
  selectedLocation: string;
  setSelectedLocation: Dispatch<SetStateAction<string>>;
  estimatedTime: string;
  setEstimatedTime: Dispatch<SetStateAction<string>>;
}

// creating context
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// provider component
export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [openLocationBox, setOpenLocationBox] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const [estimatedTime, setEstimatedTime] = useState<string>('');

  useEffect(() => {
    const storedTime = localStorage.getItem("estimatedTime");
    if (storedTime) {
      setEstimatedTime(storedTime);
    }
  }, []);

  useEffect(() => {
    if (estimatedTime !== null) {
      localStorage.setItem("estimatedTime", estimatedTime);
    }
  }, [estimatedTime]);


  return (
    <LocationContext.Provider value={{
      openLocationBox,
      setOpenLocationBox,
      selectedLocation,
      setSelectedLocation,
      estimatedTime,
      setEstimatedTime,

    }}>
      {children}
    </LocationContext.Provider>
  )
}

// custom hook
export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocation must be used within a LocationProvider");
  return context;
};
