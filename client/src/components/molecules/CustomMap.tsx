import { LatLng, LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import CustomZoomControl from './ZoomControl';
import { useContext } from 'react';
import MapStyleContext from '../../context/MapStyleContext';

export const kirunaLatLngCoords: LatLngExpression = [67.85572, 20.22513];

interface CustomMapProps {
  center?: LatLng;
  zIndex?: number;
  allMunicipality?: boolean
  children: any;
}

const CustomMap: React.FC<CustomMapProps> = ({
  center, 
  zIndex = 0, 
  allMunicipality,
  children 
}) => {
  const {mapType} = useContext(MapStyleContext);
  
  return (
    <MapContainer
      style={{ width: '100%', height: '100%', zIndex: zIndex }}
      center={center || kirunaLatLngCoords}
      zoom={!allMunicipality ? 13 : 8}
      doubleClickZoom={false}
      scrollWheelZoom={true}
      minZoom={8}
      zoomControl={false}
      touchZoom={true}
      maxBounds={[
        [67.0, 17.8],
        [69.5, 23.4],
      ]}
      maxBoundsViscosity={0.9}
    >
      {mapType === 'osm' ? (
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    ) : (
      <TileLayer
        attribution='ArcGIS'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
    )}
    <CustomZoomControl />

      {children}
    </MapContainer>
  );
};

export default CustomMap;
