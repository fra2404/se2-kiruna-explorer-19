import React, { useContext, useRef } from 'react';
import { LatLng } from 'leaflet';
import { Polygon } from 'react-leaflet';
import MapStyleContext from '../../../context/MapStyleContext';

interface AreaProps {
  id: string;
  areaCoordinates: LatLng[];
}

export const Area: React.FC<AreaProps> = ({
  id,
  areaCoordinates,
}) => {
  const {swedishFlagBlue, satMapMainColor, mapType} = useContext(MapStyleContext);
  const polygonRef = useRef<L.Polygon>(null);

  return (
    <>
      <Polygon
        key={id}
        pathOptions={{ color: mapType == "sat" ? satMapMainColor : swedishFlagBlue }}
        positions={areaCoordinates as unknown as LatLng[]}
        ref={polygonRef}
      >
      </Polygon>
    </>
  );
};
