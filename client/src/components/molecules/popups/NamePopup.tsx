import React, { useState, useRef } from 'react';
import { Popup } from 'react-leaflet';
import { LatLng } from 'leaflet';
import Modal from 'react-modal';

import ButtonRounded from '../../atoms/button/ButtonRounded';
import { modalStyles } from '../../../pages/KirunaMap';
import InputComponent from '../../atoms/input/input';

interface NamePopupProps {
  position: LatLng;
  coordName: string;
  setCoordName: (name: string) => void;
  setCoordNamePopupOpen: (open: boolean) => void;
  setPosition: (position: LatLng | undefined) => void;
}

const NamePopup: React.FC<NamePopupProps> = ({
  position,
  coordName,
  setCoordName,
  setCoordNamePopupOpen,
  setPosition,
}) => {
  const popupRef = useRef<L.Popup>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Popup ref={popupRef} position={position}>
        <InputComponent
          label="Enter the name of the new point/area"
          type="text"
          placeholder="Enter the name of the new point/area..."
          required={true}
          value={coordName}
          onChange={(v) => {
            if ('target' in v) {
              setCoordName(v.target.value);
            }
          }}
        />
        <div className="flex justify-between">
          <ButtonRounded
            variant="filled"
            text="Confirm"
            className="bg-black text-white text-xs pt-2 pb-2 pl-3 pr-3"
            onClick={() => {
              if (coordName.trim() != '') {
                setCoordNamePopupOpen(false);
                popupRef.current?.remove();
              }
            }}
          />
          <ButtonRounded
            variant="outlined"
            text="Cancel"
            className="text-xs pt-2 pb-2 pl-3 pr-3"
            onClick={() => {
              setPosition(undefined);
              setCoordName('');
              setCoordNamePopupOpen(false);
              popupRef.current?.remove();
            }}
          />
        </div>
      </Popup>
      <Modal
        style={modalStyles}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
      >
        <div>
          <h2>Enter the name of the new point/area</h2>
          <InputComponent
            label="Name"
            type="text"
            placeholder="Enter the name..."
            required={true}
            value={coordName}
            onChange={(v) => {
              if ('target' in v) {
                setCoordName(v.target.value);
              }
            }}
          />
          <ButtonRounded
            variant="filled"
            text="Confirm"
            className="bg-black text-white text-xs pt-2 pb-2 pl-3 pr-3"
            onClick={() => {
              if (coordName.trim() != '') {
                setCoordNamePopupOpen(false);
                setModalOpen(false);
              }
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default NamePopup;
