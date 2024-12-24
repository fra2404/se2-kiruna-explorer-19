import React, { useContext } from 'react';
import Image from 'react-bootstrap/Image';
import MapStyleContext from '../../../context/MapStyleContext';

import './MapSwitch.css';

const MapSwitch: React.FC = () => {
  const { mapType, setMapType } = useContext(MapStyleContext);

  const handleClick = () => {
    if (mapType === 'osm') {
      setMapType('sat');
    } else {
      setMapType('osm');
    }
  };

  return mapType === 'osm' ? (
    <Image
      className="mini-map custom-thumbnail"
      fluid
      thumbnail={true}
      src="/assets/kiruna_sat.png"
      rounded
      onClick={handleClick}
    />
  ) : (
    <Image
      className="mini-map custom-thumbnail"
      fluid
      thumbnail={true}
      src="/assets/kiruna_osm.png"
      rounded
      onClick={handleClick}
    />
  );
};

export default MapSwitch;
