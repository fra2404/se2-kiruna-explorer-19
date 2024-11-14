import React, {
    createContext,
    useState,
    ReactNode,
} from 'react';

interface MapStyleContextType {
    mapType: string;
    setMapType: (arg0: string) => void;
}



const MapStyleContext = createContext<MapStyleContextType | undefined>(undefined);

export const MapStyleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [mapType, setMapType] = useState('osm'); // State for map type


    return (
        <MapStyleContext.Provider value={{ mapType, setMapType }}>
            {children}
        </MapStyleContext.Provider>
    );
};

export default MapStyleContext;
