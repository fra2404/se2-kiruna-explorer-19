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
import MapStyleContext from '../../../context/MapStyleContext';
import { useContext } from 'react';

interface PointProps {
  id: string;
  pointCoordinates: LatLng;
  name: string;
  coordinates: LatLng;
  setCoordinates: (coordinates: LatLng) => void;
  pointDocuments: IDocument[];
  allDocuments: IDocument[];
  setDocuments: (documents: IDocument[]) => void;
}

export const Point: React.FC<PointProps> = ({
  id,
  pointCoordinates,
  name,
  coordinates,
  setCoordinates,
  pointDocuments,
  allDocuments,
  setDocuments
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPointId, setSelectedPointId] = useState('');
  const markerRef = useRef<L.Marker>(null);
  const { swedishFlagBlue, satMapMainColor, mapType } = useContext(MapStyleContext);

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
              backgroundColor: pointDocuments.length == 1 ? "white" : mapType == "sat" ? satMapMainColor : swedishFlagBlue,  //#ccdbdc
              color: mapType == "sat" ? "black" : "white",
              borderRadius: "50% 50% 50% 0",
              transform: "rotate(-45deg)",
              fontSize: "20px",
              fontWeight: "bold",
              border: "2px solid black",
              padding: pointDocuments.length == 1 ? "1px" : "0px"
            }}>
              <span style={{ transform: "rotate(45deg)" }}>
                {pointDocuments.length == 1 ?
                  <DocumentIcon type={pointDocuments[0].type} stakeholders={pointDocuments[0].stakeholders} />
                  :
                  pointDocuments.length
                }
              </span>
            </div>
          ),
        })
      }>
        <MapPopup
          name={name}
          message="Do you want to add a document in this point?"
          documents={pointDocuments}
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
          documents={allDocuments}
          setDocuments={setDocuments}
          selectedCoordIdProp={selectedPointId}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      </Modal>
    </>
  );
};
