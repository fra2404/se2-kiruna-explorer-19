import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

interface MarkerWithPopupProps {
  position: [number, number];
  icon: Icon;
  popupText: string;
}

const MarkerWithPopup: React.FC<MarkerWithPopupProps> = ({
  position,
  icon,
  popupText,
}) => {
  return (
    <Marker position={position} icon={icon}>
      <Popup>{popupText}</Popup>
    </Marker>
  );
};

export default MarkerWithPopup;
