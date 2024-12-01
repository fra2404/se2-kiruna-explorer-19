import React, { useRef } from 'react';
import { Popup } from 'react-leaflet';
import { LatLng } from 'leaflet';

import ButtonRounded from '../../atoms/button/ButtonRounded';
import InputComponent from '../../atoms/input/input';

interface NamePopupProps {
  position: LatLng;
  coordName: string;
  setCoordName: (name: string) => void;
  setCoordNamePopupOpen: (open: boolean) => void;
  setPosition: (position: LatLng | undefined) => void;
  errors: {[key: string]: string}
}

const NamePopup: React.FC<NamePopupProps> = ({
  position,
  coordName,
  setCoordName,
  setCoordNamePopupOpen,
  setPosition,
  errors
}) => {
  const popupRef = useRef<L.Popup>(null);

  return (
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
        error={errors.newPoint}
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
  );
};

export default NamePopup;
