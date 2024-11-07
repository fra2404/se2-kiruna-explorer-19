import { useRef, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLng } from 'leaflet';
import { ButtonRounded } from './Button';
import Modal from 'react-modal';
import DocumentForm from './DocumentForm';
import { modalStyles } from './Map';

interface MarkersProps {
  id: string;
  pointCoordinates: LatLng;
  name: string;
  coordinates: any;
  isLoggedIn: boolean;
}

export default function Markers({
  id,
  pointCoordinates,
  name,
  coordinates,
  isLoggedIn,
}: MarkersProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPointId, setSelectedPointId] = useState('');
  const markerRef = useRef<L.Marker>(null);

  return (
    <>
      <Marker
        key={id}
        position={pointCoordinates}
        ref={markerRef}
        //icon={document.icon} // Use the selected icon
      >
        <Popup>
          <span className="text-lg font-bold">{name}</span>
          <br />
          {isLoggedIn && (
            <>
              <span className="text-base">
                Do you want to add a document in this point?
              </span>
              <br />
              <br />
              <div className="flex justify-between">
                <ButtonRounded
                  variant="filled"
                  text="Yes"
                  className="bg-black text-white text-base pt-2 pb-2 pl-3 pr-3"
                  onClick={() => {
                    markerRef.current?.closePopup();
                    setSelectedPointId(id);
                    if (!modalOpen) setModalOpen(true);
                  }}
                />
                <ButtonRounded
                  variant="outlined"
                  text="Cancel"
                  className="text-base pt-2 pb-2 pl-3 pr-3"
                  onClick={() => {
                    markerRef.current?.closePopup();
                  }}
                />
              </div>
            </>
          )}
        </Popup>
      </Marker>

      <Modal
        style={modalStyles}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
      >
        <DocumentForm
          coordinates={coordinates}
          selectedCoordIdProp={selectedPointId}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      </Modal>
    </>
  );
}
