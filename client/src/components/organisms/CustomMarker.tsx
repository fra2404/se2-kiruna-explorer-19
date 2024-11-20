import React from 'react';
import MarkerWithPopup from '../molecules/MarkerWithPopup';
import IconComponent from '../atoms/IconComponent';

interface CustomMarkerProps {
  coordinates: [number, number];
  popupText: string;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({
  coordinates,
  popupText,
}) => {
  const legalIcon = IconComponent({
    iconUrl:
      'https://img.icons8.com/external-icongeek26-linear-colour-icongeek26/64/external-legal-business-and-finance-icongeek26-linear-colour-icongeek26.png',
    iconSize: [35, 35],
    iconAnchor: coordinates,
    popupAnchor: [-45, -20],
  });

  return (
    <MarkerWithPopup
      position={coordinates}
      icon={legalIcon}
      popupText={popupText}
    />
  );
};

export default CustomMarker;
