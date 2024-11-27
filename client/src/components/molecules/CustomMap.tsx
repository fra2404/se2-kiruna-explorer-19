import { LatLng, LatLngExpression } from 'leaflet';
import { MapContainer } from 'react-leaflet';

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
      {children}
    </MapContainer>
  );
};

export default CustomMap;
