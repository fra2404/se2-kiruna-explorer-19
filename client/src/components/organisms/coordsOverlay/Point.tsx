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
  pointCoordinates: LatLng | LatLng[];
  name: string;
  type: string;
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
  type,
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
      <Marker key={id} 
        position={
          type == "Point" ? 
            pointCoordinates as LatLng 
          : 
            calculateCentroid(pointCoordinates as LatLng[])
        }
        
        ref={markerRef} 
        
        icon={
          new DivIcon({
            iconSize: [45, 45],
            className: "pointIcon",
            html: renderToString(
              <div style={
                CoordsIconStyle(pointDocuments, true)
                }>
                <span style={{transform: "rotate(45deg)"}}>
                {pointDocuments.length == 1 ? 
                  <DocumentIcon type={pointDocuments[0].type} stakeholders={pointDocuments[0].stakeholders} /> 
                  :
                  pointDocuments.length
                }
                </span>
              </div>
            ),
            iconAnchor: [10, 41]
          })
        }
      >
        <MapPopup
          name={name}
          message="Do you want to add a document in this coordinate?"
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


function calculateCentroid(coords: LatLng[]): LatLng {
  let latSum = 0, lngSum = 0;
  const n = coords.length;

  coords.forEach((c: any) => {
    latSum += c[0];
    lngSum += c[1];
  });

  return new LatLng(latSum / n, lngSum / n);
}