import React, { useRef } from 'react';
import { Popup } from 'react-leaflet';
import ButtonRounded from '../atoms/button/ButtonRounded';
import { IDocument } from '../../utils/interfaces/document.interface';
import { MarkerDocumentList } from './documentsItems/MarkerDocumentList';
import { IDocumentResponse } from "../../../utils/interfaces/document.interface"

interface MapPopupProps {
  name: string;
  isLoggedIn: boolean;
  message: string;
  documents: IDocument[];
  onYesClick: () => void;
  onCancelClick: () => void;
}

export const MapPopup: React.FC<MapPopupProps> = ({
  name,
  isLoggedIn,
  message,
  documents,
  onYesClick,
  onCancelClick,
}) => {
  const popupRef = useRef<L.Popup>(null);

  return (
    <Popup ref={popupRef}>
      <span className="text-lg font-bold">{name}</span>
      <br />
      <MarkerDocumentList documents={documents}/>

      <hr />

      {isLoggedIn && (
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
            <ButtonRounded
              variant="outlined"
              text="Cancel"
              className="text-base pt-2 pb-2 pl-3 pr-3"
              onClick={onCancelClick}
            />
          </div>
        </>
      )}
    </Popup>
  );
};
