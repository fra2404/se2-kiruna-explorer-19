import React, { useState, useRef } from 'react';
import { useMapEvents, Popup } from 'react-leaflet';
import { LatLng } from 'leaflet';
import Modal from 'react-modal';
import ButtonRounded from '../../atoms/button/ButtonRounded';
import { IDocument } from '../../../utils/interfaces/document.interface';
import DocumentForm from '../DocumentForm';
import { modalStyles } from '../../../pages/KirunaMap';
import { isMarkerInsideKiruna } from '../../../utils/isMarkerInsideKiruna';

interface ClickMarkerProps {
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  documents: IDocument[];
  setDocuments: (documents: IDocument[]) => void;
  filteredDocuments: IDocument[];
  setFilteredDocuments: (documents: IDocument[]) => void;
}

const ClickMarker: React.FC<ClickMarkerProps> = ({ 
  coordinates,
  setCoordinates,
  documents,
  setDocuments,
  filteredDocuments,
  setFilteredDocuments
}) => {
  const [position, setPosition] = useState<LatLng | null>(null);
  useMapEvents({
    dblclick(e) {
      setPosition(e.latlng);
    },
  });
  const popupRef = useRef<L.Popup>(null);

  const [modalOpen, setModalOpen] = useState(false);

  return position === null ? null : (
    <>
      <Popup ref={popupRef} position={position}>
        {
          isMarkerInsideKiruna(position) ? (
            <>
              <span className="text-base">
                Do you want to add a document in this position?
              </span>
              <br />
              <br />
              <div className="flex justify-between">
                <ButtonRounded
                  variant="filled"
                  text="Yes"
                  className="bg-black text-white text-base pt-2 pb-2 pl-3 pr-3"
                  onClick={() => {
                    if (!modalOpen) {
                      setModalOpen(true);
                      popupRef.current?.remove();
                    }
                  }}
                />
                <ButtonRounded
                  variant="outlined"
                  text="Cancel"
                  className="text-base pt-2 pb-2 pl-3 pr-3"
                  onClick={() => {
                    popupRef.current?.remove();
                    setPosition(null);
                  }}
                />
              </div>
            </>
          ) : 
          <>
            <span className='text-red-500 text-base'>
              Error: point is outside of Kiruna Borders
            </span>
            <br /><br />
            <ButtonRounded
              variant="outlined"
              text="Cancel"
              className="text-base pt-2 pb-2 pl-3 pr-3"
              onClick={() => {
                popupRef.current?.remove();
                setPosition(null);
              }}
            />
          </>
        }
      </Popup>

      <DocumentForm
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        documents={documents}
        setDocuments={setDocuments}
        filteredDocuments={filteredDocuments}
        setFilteredDocuments={setFilteredDocuments}
        positionProp={position}
        showCoordNamePopup={true}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
};

export default ClickMarker;