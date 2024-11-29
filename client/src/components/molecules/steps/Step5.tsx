import { LatLng } from 'leaflet';
import MapSection from '../../organisms/MapSection';

interface Step5Props {
  coordinates: any;
  selectedCoordIdProp: string;
  selectedCoordId: string;
  setSelectedCoordId: (value: string) => void;
  setCoordNamePopupOpen: (open: boolean) => void;
  position: LatLng | undefined;
  setPosition: (position: LatLng | undefined) => void;
  coordNamePopupOpen: boolean;
  coordName: string;
  setCoordName: (name: string) => void;
  MapClickHandler: React.FC;
  errors: {[key: string]: string}
}

const Step5: React.FC<Step5Props> = ({
  coordinates,
  selectedCoordIdProp,
  selectedCoordId,
  setSelectedCoordId,
  setCoordNamePopupOpen,
  position,
  setPosition,
  coordNamePopupOpen,
  coordName,
  setCoordName,
  MapClickHandler,
  errors
}) => {
  return (
    <MapSection
      coordinates={coordinates}
      selectedCoordIdProp={selectedCoordIdProp}
      selectedCoordId={selectedCoordId}
      setSelectedCoordId={setSelectedCoordId}
      setCoordNamePopupOpen={setCoordNamePopupOpen}
      position={position}
      setPosition={setPosition}
      coordNamePopupOpen={coordNamePopupOpen}
      coordName={coordName}
      setCoordName={setCoordName}
      MapClickHandler={MapClickHandler}
      errors={errors}
    />
  );
};

export default Step5;
