import L from 'leaflet';

interface IconComponentProps {
  iconUrl: string;
  iconSize: [number, number];
  iconAnchor: [number, number];
  popupAnchor: [number, number];
}

const IconComponent = ({
  iconUrl,
  iconSize,
  iconAnchor,
  popupAnchor,
}: IconComponentProps): L.Icon => {
  return L.icon({
    iconUrl,
    iconSize,
    iconAnchor,
    popupAnchor,
  });
};

export default IconComponent;
