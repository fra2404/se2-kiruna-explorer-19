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
import { CoordsIconStyle } from '../../molecules/MapIconsStyles';

interface PointProps {
  id: string;
  pointCoordinates: LatLng;
  name: string;
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
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

  return (
    <>
      <Marker key={id} position={pointCoordinates} ref={markerRef} icon={
        new DivIcon({
          iconSize:  id!="all_municipality" ? [45, 45] : [60, 60],
          className: "pointIcon",
          html: renderToString(
            <div style={
              CoordsIconStyle(pointDocuments, id != "all_municipality" ? true : false, id == "all_municipality")
              }>
              <span style={{transform: "rotate(45deg)"}}>
              {
                id!="all_municipality" ?
                  pointDocuments.length == 1 ? 
                    <DocumentIcon type={pointDocuments[0].type} stakeholders={pointDocuments[0].stakeholders} /> 
                    :
                    pointDocuments.length
                :
                  "AM"
              }
              </span>
            </div>
          ),
        })
      }>
        <MapPopup
          name={name}
          message="Do you want to add a document in this point?"
          markerDocuments={pointDocuments}
          onYesClick={() => {
            markerRef.current?.closePopup();
            setSelectedPointId(id);
            if (!modalOpen) setModalOpen(true);
          }}
          onCancelClick={() => {
            markerRef.current?.closePopup();
          }}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          allDocuments={allDocuments}
          setDocuments={setDocuments}
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
