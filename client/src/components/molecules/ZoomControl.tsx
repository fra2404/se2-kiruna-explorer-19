import { useMap } from 'react-leaflet';
import { useState } from 'react';
import { ButtonRounded } from '../Button';

function CustomZoomControl() {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  const handleZoomIn = () => {
    map.zoomIn();
    setZoom(map.getZoom());
  };

  const handleZoomOut = () => {
    map.zoomOut();
    setZoom(map.getZoom());
  };

  return (
    <div className="leaflet-bottom leaflet-left flex flex-col mb-4 ml-4">
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
  );
}

export default CustomZoomControl;
