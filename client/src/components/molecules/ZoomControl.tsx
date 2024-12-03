import { useMap } from 'react-leaflet';
import { useState } from 'react';
import ButtonRounded from '../atoms/button/ButtonRounded';
import MapSwitch from '../atoms/map-switch/MapSwitch';

function CustomZoomControl() {
  const map = useMap();
  const [_zoom, setZoom] = useState(map.getZoom());

  const handleZoomIn = () => {
    map.zoomIn();
    setZoom(map.getZoom());
  };

  const handleZoomOut = () => {
    map.zoomOut();
    setZoom(map.getZoom());
  };

  return (
    <div
      style={{
        pointerEvents: 'auto',
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1000,
      }}
      className="leaflet-bottom leaflet-left flex flex-row mb-4 ml-4 "
    >
      <div style={{ pointerEvents: 'auto' }}>
        <ButtonRounded
          variant="filled"
          text="+"
          className="bg-black text-white text-lg w-12 h-12 rounded-full flex items-center justify-center mb-2"
          onClick={handleZoomIn}
        />
        <ButtonRounded
          variant="filled"
          text="-"
          className="bg-black text-white text-lg w-12 h-12 rounded-full flex items-center justify-center"
          onClick={handleZoomOut}
        />
      </div>
      <MapSwitch />
    </div>
  );
}

export default CustomZoomControl;
