import React, { createContext, useState, ReactNode } from 'react';

import {
  swedishFlagBlue,
  swedishFlagYellow,
  satMapMainColor,
} from '../utils/colors';

interface MapStyleContextType {
  swedishFlagBlue: string;
  swedishFlagYellow: string;
  satMapMainColor: string;
  mapType: string;
  setMapType: (arg0: string) => void;
}

const MapStyleContext = createContext<MapStyleContextType>(
  {} as MapStyleContextType,
);

export const MapStyleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  //This blue and yellow are from the Swedish flag

  const [mapType, setMapType] = useState('sat'); // State for map type

  return (
    <MapStyleContext.Provider
      value={{
        swedishFlagBlue,
        swedishFlagYellow,
        satMapMainColor,
        mapType,
        setMapType,
      }}
    >
      {children}
    </MapStyleContext.Provider>
  );
};

export default MapStyleContext;
