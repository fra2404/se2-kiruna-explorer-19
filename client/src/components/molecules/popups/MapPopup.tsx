import React, { useRef } from 'react';
import { Popup } from 'react-leaflet';

import ButtonRounded from '../../atoms/button/ButtonRounded';
import { IDocument } from '../../../utils/interfaces/document.interface';
import { MarkerDocumentList } from '../documentsItems/MarkerDocumentList';
import { useAuth } from '../../../context/AuthContext';
import { UserRoleEnum } from '../../../utils/interfaces/user.interface';
import { kirunaLatLngCoords } from '../CustomMap';

interface MapPopupProps {
  name: string;
  message: string;
  markerDocuments: IDocument[];
  onYesClick: () => void;
  onCancelClick: () => void;
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  allDocuments: IDocument[];
  setDocuments: (documents: IDocument[]) => void;
  allMunicipality?: boolean
}

export const MapPopup: React.FC<MapPopupProps> = ({
  name,
  message,
  markerDocuments,
  onYesClick,
  onCancelClick,
  coordinates,
  setCoordinates,
  allDocuments,
  setDocuments,
  allMunicipality
}) => {
  const popupRef = useRef<L.Popup>(null);
  const { isLoggedIn, user } = useAuth();

  return (
    <Popup 
      ref={popupRef} offset={[10, -10]} 
      position={allMunicipality ? kirunaLatLngCoords : undefined}
      closeButton={!allMunicipality} 
      closeOnClick={!allMunicipality} 
      closeOnEscapeKey={!allMunicipality} 
      autoClose={!allMunicipality}
    >
      <span className="text-lg font-bold">{name}</span>
      <br />
      <MarkerDocumentList 
        markerDocuments={markerDocuments}
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        allDocuments={allDocuments}
        setDocuments={setDocuments}
      />

      <hr />

      {(isLoggedIn && user && user.role === UserRoleEnum.Uplanner) && (
        <>
          <span className="text-base">{message}</span>
          <br />
          <div className="flex justify-between">
            <ButtonRounded
              variant="filled"
              text="Yes"
              className="bg-black text-white text-base pt-2 pb-2 pl-3 pr-3"
              onClick={onYesClick}
            />
            {!allMunicipality &&
              <ButtonRounded
                variant="outlined"
                text="Cancel"
                className="text-base pt-2 pb-2 pl-3 pr-3"
                onClick={onCancelClick}
              />
            }
          </div>
        </>
      )}
    </Popup>
  );
};
