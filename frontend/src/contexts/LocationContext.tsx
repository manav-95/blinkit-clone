import React, { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";

type LocationFeature = {
  properties: {
    formatted: string;
    city?: string;
    state?: string;
    country?: string;
    street?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
};
// define context type
interface LocationContextType {
  openLocationBox: boolean;
  setOpenLocationBox: Dispatch<SetStateAction<boolean>>;
  selectedLocation: string;
  setSelectedLocation: Dispatch<SetStateAction<string>>;
  estimatedTime: string;
  setEstimatedTime: Dispatch<SetStateAction<string>>;
  openAddressWindow: boolean;
  setOpenAddressWindow: Dispatch<SetStateAction<boolean>>;
  selectedAddress: LocationFeature | null;
  setSelectedAddress: Dispatch<SetStateAction<LocationFeature | null>>;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
}

// creating context
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// provider component
export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [openLocationBox, setOpenLocationBox] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const [estimatedTime, setEstimatedTime] = useState<string>('');

  const [openAddressWindow, setOpenAddressWindow] = useState<boolean>(false)
  const [address, setAddress] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<LocationFeature | null>(null)

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
      openAddressWindow,
      setOpenAddressWindow,
      selectedAddress,
      setSelectedAddress,
      address,
      setAddress,
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
