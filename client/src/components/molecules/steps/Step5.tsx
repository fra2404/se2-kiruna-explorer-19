import { LatLng } from 'leaflet';
import MapSection from '../../organisms/MapSection';

interface Step5Props {
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  showToastMessage: (message: string, type: "success" | "error") => void;
  selectedCoordIdProp: string;
  selectedCoordId: string;
  setSelectedCoordId: (value: string) => void;
  coordNamePopupOpen: boolean;
  setCoordNamePopupOpen: (open: boolean) => void;
  position: LatLng | undefined;
  setPosition: (position: LatLng | undefined) => void;
  coordName: string;
  setCoordName: (name: string) => void;
  MapClickHandler: React.FC;
  errors: {[key: string]: string}
}

const Step5: React.FC<Step5Props> = ({
  coordinates,
  setCoordinates,
  showToastMessage,
  selectedCoordIdProp,
  selectedCoordId,
  setSelectedCoordId,
  coordNamePopupOpen,
  setCoordNamePopupOpen,
  position,
  setPosition,
  coordName,
  setCoordName,
  MapClickHandler,
  errors
}) => {
  return (
    <MapSection
      coordinates={coordinates}
      setCoordinates={setCoordinates}
      showToastMessage={showToastMessage}
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
