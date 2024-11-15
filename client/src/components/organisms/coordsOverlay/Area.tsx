import React, { useContext, useState } from 'react';
import { LatLng } from 'leaflet';
import { Polygon } from 'react-leaflet';
import Modal from 'react-modal';
import { IDocument } from '../../../utils/interfaces/document.interface';
import { MapPopup } from '../../molecules/popups/MapPopup';
import { modalStyles } from '../../../pages/KirunaMap';
import DocumentForm from '../DocumentForm';
import MapStyleContext from '../../../context/MapStyleContext';

interface AreaProps {
  isLoggedIn: boolean;
  id: string;
  areaCoordinates: LatLng[];
  name: string;
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  areaDocuments: IDocument[];
  allDocuments: IDocument[];
  setDocuments: (documents: IDocument[]) => void;
}

export const Area: React.FC<AreaProps> = ({
  id,
  areaCoordinates,
  name,
  coordinates,
  setCoordinates,
  isLoggedIn,
  areaDocuments,
  allDocuments,
  setDocuments
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const {swedishFlagBlue, satMapMainColor, mapType} = useContext(MapStyleContext);

  return (
    <>
      <Polygon
        key={id}
        pathOptions={{ color: mapType == "sat" ? satMapMainColor : swedishFlagBlue }}
        positions={areaCoordinates as unknown as LatLng[]}
      >
        <MapPopup
          name={name}
          isLoggedIn={isLoggedIn}
          message="Do you want to add a document in this area?"
          documents={areaDocuments}
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
          documents={allDocuments}
          setDocuments={setDocuments}
          selectedCoordIdProp={selectedAreaId}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      </Modal>
    </>
  );
};
