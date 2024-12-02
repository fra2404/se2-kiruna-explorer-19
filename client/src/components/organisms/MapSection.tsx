import React, { useContext } from 'react';
import { Marker, Tooltip, Polygon } from 'react-leaflet';
import { LatLng } from 'leaflet';
import InputComponent from '../atoms/input/input';
import NamePopup from '../molecules/popups/NamePopup';
import MapStyleContext from '../../context/MapStyleContext';
import CustomMap from '../molecules/CustomMap';

interface MapSectionProps {
  coordinates: any;
  selectedCoordIdProp: string;
  selectedCoordId: string;
  setSelectedCoordId: (value: string) => void;
  setCoordNamePopupOpen: (open: boolean) => void;
  position: LatLng | undefined;
  setPosition: (position: LatLng | undefined) => void;
  coordNamePopupOpen: boolean;
  coordName: string;
  setCoordName: (name: string) => void;
  MapClickHandler: React.FC;
  errors: {[key: string]: string}
}

const MapSection: React.FC<MapSectionProps> = ({
  coordinates,
  selectedCoordIdProp,
  selectedCoordId,
  setSelectedCoordId,
  setCoordNamePopupOpen,
  position,
  setPosition,
  coordNamePopupOpen,
  coordName,
  setCoordName,
  MapClickHandler,
  errors
}) => {
  const { swedishFlagBlue, satMapMainColor, mapType } =
    useContext(MapStyleContext);

  return (
    <div className="col-span-2">
      <h4>Document position:</h4>
      <div
        className="w-full grid grid-rows-[auto_1fr] md:text-center"
        style={{ height: '50vh' }}
      >
        <div className="w-80 justify-self-end" style={{ zIndex: 1000 }}>
          <InputComponent
            label="Select an area or point that already exists"
            type="select"
            options={[
              {value: 'all_municipality', label: 'All Municipality'},
              ...Object.entries(coordinates).map(
                ([areaId, info]: [string, any]) => {
                  return { value: areaId, label: info['name'] };
                },
              )]
            }
            defaultValue={selectedCoordIdProp? selectedCoordId : 'all_municipality'}
            value={selectedCoordId}
            onChange={(v: any) => {
              setSelectedCoordId(v.target.value != 'all_municipality' ? v.target.value : undefined);
              setCoordNamePopupOpen(false);
              if (
                selectedCoordId &&
                coordinates[v.target.value]['type'] == 'Point'
              ) {
                setPosition(
                  new LatLng(
                    coordinates[v.target.value]['coordinates'][0],
                    coordinates[v.target.value]['coordinates'][1],
                  ),
                );
              } else {
                setPosition(undefined);
              }
            }}
          />
        </div>

        <CustomMap center={position}>
          {(position ??
            (selectedCoordId &&
              coordinates[selectedCoordId]['type'] == 'Point')) && (
            <Marker
              position={
                position ??
                new LatLng(
                  coordinates[selectedCoordId]['coordinates'][0],
                  coordinates[selectedCoordId]['coordinates'][1],
                )
              }
            >
              <Tooltip permanent>
                {selectedCoordId
                  ? coordinates[selectedCoordId]['name']
                  : coordName}
              </Tooltip>
            </Marker>
          )}

          {coordNamePopupOpen && position && (
            <NamePopup
              position={position}
              coordName={coordName}
              setCoordName={setCoordName}
              setCoordNamePopupOpen={setCoordNamePopupOpen}
              setPosition={setPosition}
              errors={errors}
            />
          )}

          {selectedCoordId &&
            coordinates[selectedCoordId]['type'] == 'Polygon' && (
              <Polygon
                pathOptions={{
                  color: mapType == 'sat' ? satMapMainColor : swedishFlagBlue,
                }}
                positions={coordinates[selectedCoordId]['coordinates']}
              ></Polygon>
            )}

          <MapClickHandler />
          
        </CustomMap>

      </div>
    </div>
  );
};

export default MapSection;
