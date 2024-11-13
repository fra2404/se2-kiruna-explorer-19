import React, { useRef, useState } from 'react';
import { Marker } from 'react-leaflet';
import { DivIcon, LatLng } from 'leaflet';
import Modal from 'react-modal';
import { IDocument } from '../../../utils/interfaces/document.interface';
import { MapPopup } from '../../molecules/popups/MapPopup';
import { modalStyles } from '../../../pages/KirunaMap';
import DocumentForm from '../DocumentForm';
import { DocumentIcon } from '../../molecules/documentsItems/DocumentIcon';
import { renderToString } from 'react-dom/server';

interface PointProps {
  id: string;
  pointCoordinates: LatLng;
  name: string;
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  isLoggedIn: boolean;
  documents: IDocument[];
  setDocuments: (documents: IDocument[]) => void;
}

export const Point: React.FC<PointProps> = ({
  id,
  pointCoordinates,
  name,
  coordinates,
  setCoordinates,
  isLoggedIn,
  documents,
  setDocuments
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPointId, setSelectedPointId] = useState('');
  const markerRef = useRef<L.Marker>(null);

  return (
    <>
      <Marker key={id} position={pointCoordinates} ref={markerRef} icon={
        new DivIcon({
          iconSize: [45, 45],
          className: "pointIcon",
          html: renderToString(
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
              backgroundColor: documents.length == 1 ? "white" : "#006AA7",   //TODO: is it better like this or with only the document icon?
              color: "white",
              borderRadius: "50% 50% 50% 0",
              transform: "rotate(-45deg)",
              fontSize: "20px",
              fontWeight: "bold",
              border: "2px solid black",
              padding: documents.length == 1 ? "1px" : "0px"
            }}>
              <span style={{transform: "rotate(45deg)"}}>
              {documents.length == 1 ? 
                <DocumentIcon type={documents[0].type} stakeholders={documents[0].stakeholders} /> 
                :
                documents.length
              }
              </span>
           </div>
          ),
        })
      }>
        <MapPopup
          name={name}
          isLoggedIn={isLoggedIn}
          message="Do you want to add a document in this point?"
          documents={documents}
          onYesClick={() => {
            markerRef.current?.closePopup();
            setSelectedPointId(id);
            if (!modalOpen) setModalOpen(true);
          }}
          onCancelClick={() => {
            markerRef.current?.closePopup();
          }}
        />
      </Marker>

      <Modal
        style={modalStyles}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
      >
        <DocumentForm
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          documents={documents}
          setDocuments={setDocuments}
          selectedCoordIdProp={selectedPointId}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      </Modal>
    </>
  );
};
