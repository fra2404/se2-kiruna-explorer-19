import { LatLng, LatLngExpression } from "leaflet"
import { MapContainer } from "react-leaflet"

export const kirunaLatLngCoords: LatLngExpression = [67.85572, 20.22513];

interface CustomMapProps {
  center?: LatLng;
  children: any
}

const CustomMap: React.FC<CustomMapProps> = ({
  center,
  children
}) => {
  return (
    <MapContainer
      style={{ width: '100%', height: '100%', zIndex: 0 }}
      center={center ? center : kirunaLatLngCoords}
      zoom={13}
      doubleClickZoom={false}
      scrollWheelZoom={true}
      minZoom={9}
      zoomControl={false}
      touchZoom={true}
      maxBounds={[
        [67.8, 19.9],
        [67.9, 20.5],
      ]}
      maxBoundsViscosity={0.9}
    >
      {children}
    </MapContainer>
  )
}

export default CustomMap;