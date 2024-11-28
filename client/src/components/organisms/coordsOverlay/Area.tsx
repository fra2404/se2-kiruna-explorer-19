import React, { useContext } from 'react';
import { LatLng } from 'leaflet';
import { Polygon } from 'react-leaflet';
import MapStyleContext from '../../../context/MapStyleContext';

interface AreaProps {
  id: string;
  areaCoordinates: LatLng[];
  areaRef: any
}

export const Area: React.FC<AreaProps> = ({
  id,
  areaCoordinates,
  areaRef
}) => {
  const {swedishFlagBlue, satMapMainColor, mapType} = useContext(MapStyleContext);

  return (
    <>
      <Polygon
        key={id}
        pathOptions={{ color: mapType == "sat" ? satMapMainColor : swedishFlagBlue }}
        positions={areaCoordinates as unknown as LatLng[]}
        ref={areaRef}
      >
      </Polygon>
    </>
  );
};
