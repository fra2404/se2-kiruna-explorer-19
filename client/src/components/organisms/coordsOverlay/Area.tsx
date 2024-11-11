import React, { useState } from 'react';
import { LatLng } from 'leaflet';
import { Polygon } from 'react-leaflet';
import Modal from 'react-modal';
import { IDocument } from '../../../utils/interfaces/document.interface';
import { MapPopup } from '../../molecules/popups/MapPopup';
import { modalStyles } from '../../../pages/KirunaMap';
import DocumentForm from '../DocumentForm';

interface AreaProps {
  isLoggedIn: boolean;
  id: string;
  areaCoordinates: LatLng[];
  name: string;
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  documents: IDocument[];
  setDocuments: (documents: IDocument[]) => void;
}

export const Area: React.FC<AreaProps> = ({
  id,
  areaCoordinates,
  name,
  coordinates,
  setCoordinates,
  isLoggedIn,
  documents,
  setDocuments
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Polygon
        key={id}
        pathOptions={{ color: 'blue' }}
        positions={areaCoordinates as unknown as LatLng[]}
      >
        <MapPopup
          name={name}
          isLoggedIn={isLoggedIn}
          message="Do you want to add a document in this area?"
          documents={documents}
          onYesClick={() => {
            setSelectedAreaId(id);
            if (!modalOpen) setModalOpen(true);
          }}
          onCancelClick={() => {}}
        />
      </Polygon>
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
          selectedCoordIdProp={selectedAreaId}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      </Modal>
    </>
  );
};
