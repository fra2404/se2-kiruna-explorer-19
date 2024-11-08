import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Polygon,
  ZoomControl,
} from 'react-leaflet';
import { LatLng, LatLngExpression } from 'leaflet';
import InputComponent from '../atoms/input/input';
import NamePopup from '../molecules/NamePopup';

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
  kirunaLatLngCoords: LatLngExpression;
  MapClickHandler: React.FC;
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
  kirunaLatLngCoords,
  MapClickHandler,
}) => {
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
            options={Object.entries(coordinates).map(
              ([areaId, info]: [string, any]) => {
                console.log('value: ' + areaId);
                console.log('name: ' + info['name']);
                return { value: areaId, label: info['name'] };
              },
            )}
            defaultValue={selectedCoordIdProp}
            value={selectedCoordId}
            onChange={(v: any) => {
              setSelectedCoordId(v.target.value);
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

        <MapContainer
          style={{ width: '100%', height: '100%', zIndex: 10 }}
          center={position ? position : kirunaLatLngCoords}
          zoom={13}
          doubleClickZoom={false}
          scrollWheelZoom={true}
          zoomControl={false}
          touchZoom={true}
          maxBounds={[
            [67.8, 19.9],
            [67.9, 20.5],
          ]}
          maxBoundsViscosity={0.9}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {(position ||
            (selectedCoordId &&
              coordinates[selectedCoordId]['type'] == 'Point')) && (
            <Marker
              position={
                position ||
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
            />
          )}

          {selectedCoordId &&
            coordinates[selectedCoordId]['type'] == 'Polygon' && (
              <Polygon
                pathOptions={{ color: 'blue' }}
                positions={coordinates[selectedCoordId]['coordinates']}
              ></Polygon>
            )}

          <MapClickHandler />

          <ZoomControl position="bottomleft" />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapSection;
