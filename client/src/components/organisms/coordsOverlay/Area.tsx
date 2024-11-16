import React, { useContext, useRef, useState } from 'react';
import { LatLng } from 'leaflet';
import { Polygon, Tooltip } from 'react-leaflet';
import Modal from 'react-modal';
import { IDocument } from '../../../utils/interfaces/document.interface';
import { MapPopup } from '../../molecules/popups/MapPopup';
import { modalStyles } from '../../../pages/KirunaMap';
import DocumentForm from '../DocumentForm';
import MapStyleContext from '../../../context/MapStyleContext';
import { CoordsIconStyle } from '../../molecules/MapIconsStyles';
import { DocumentIcon } from '../../molecules/documentsItems/DocumentIcon';

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
  const polygonRef = useRef<L.Polygon>(null);

  return (
    <>
      <Polygon
        key={id}
        pathOptions={{ color: mapType == "sat" ? satMapMainColor : swedishFlagBlue }}
        positions={areaCoordinates as unknown as LatLng[]}
        ref={polygonRef}
      >
        <Tooltip direction="center" permanent className='pointIcon'>
          <div style={
            CoordsIconStyle(areaDocuments, false)
            }>
            <span style={{transform: "rotate(45deg)"}}>
            {areaDocuments.length == 1 ? 
              <DocumentIcon type={areaDocuments[0].type} stakeholders={areaDocuments[0].stakeholders} /> 
              :
              areaDocuments.length
            }
            </span>
          </div>
        </Tooltip>
        
        <MapPopup
          name={name}
          isLoggedIn={isLoggedIn}
          message="Do you want to add a document in this area?"
          documents={areaDocuments}
          onYesClick={() => {
            polygonRef.current?.closePopup();
            setSelectedAreaId(id);
            if (!modalOpen) setModalOpen(true);
          }}
          onCancelClick={() => {
            polygonRef.current?.closePopup();
          }}
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
