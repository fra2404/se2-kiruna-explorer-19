import React, { useContext } from 'react';
import { LatLng, LatLngExpression } from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Popup,
  Polygon,
} from 'react-leaflet';

import InputComponent from '../../atoms/input/input';
import ButtonRounded from '../../atoms/button/ButtonRounded';
import CustomZoomControl from '../ZoomControl'
import MapStyleContext from '../../../context/MapStyleContext'

interface Step5Props {
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

const Step5: React.FC<Step5Props> = ({
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
  const { mapType, setMapType } = useContext(MapStyleContext);
  return (
    <>
      {/* Document position */}
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
            minZoom={9}
            touchZoom={true}
            maxBounds={[
              [67.8, 19.9],
              [67.9, 20.5],
            ]}
            maxBoundsViscosity={0.9}
          >
            {mapType === 'osm' ? (
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            ) : (
              <TileLayer
                attribution='ArcGIS'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            )}
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
              <Popup
                position={position}
                closeButton={false}
                closeOnClick={false}
                closeOnEscapeKey={false}
                autoClose={false}
              >
                <>
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
                      }}
                    />
                  </div>
                </>
              </Popup>
            )}

            {selectedCoordId &&
              coordinates[selectedCoordId]['type'] == 'Polygon' && (
                <Polygon
                  pathOptions={{ color: 'blue' }}
                  positions={coordinates[selectedCoordId]['coordinates']}
                ></Polygon>
              )}

            <MapClickHandler />
            <CustomZoomControl />
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default Step5;
