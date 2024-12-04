import React, { useContext, useRef } from 'react';
import { Marker, Tooltip, Polygon } from 'react-leaflet';
import { LatLng } from 'leaflet';
import InputComponent from '../atoms/input/input';
import NamePopup from '../molecules/popups/NamePopup';
import MapStyleContext from '../../context/MapStyleContext';
import CustomMap from '../molecules/CustomMap';
import { ICoordinate } from '../../utils/interfaces/document.interface';
import { createCoordinate } from '../../API';
import DrawingPanel from '../molecules/DrawingPanel';

interface MapSectionProps {
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  showToastMessage: (message: string, type: "success" | "error") => void;
  selectedCoordIdProp: string;
  selectedCoordId: string;
  setSelectedCoordId: (value: string) => void;
  coordNamePopupOpen: boolean;
  setCoordNamePopupOpen: (open: boolean) => void;
  position: LatLng | undefined;
  setPosition: (position: LatLng | undefined) => void;
  coordName: string;
  setCoordName: (name: string) => void;
  MapClickHandler: React.FC;
  errors: {[key: string]: string}
}

const MapSection: React.FC<MapSectionProps> = ({
  coordinates,
  setCoordinates,
  showToastMessage,
  selectedCoordIdProp,
  selectedCoordId,
  setSelectedCoordId,
  coordNamePopupOpen,
  setCoordNamePopupOpen,
  position,
  setPosition,
  coordName,
  setCoordName,
  MapClickHandler,
  errors
}) => {
  const { swedishFlagBlue, satMapMainColor, mapType } =
    useContext(MapStyleContext);

  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const popupRef = useRef<L.Popup>(null);

  const handleAddPoint = async () => {
    if (position) {
      const coordData: ICoordinate = {
        id: '',
        name: coordName,
        type: 'Point',
        coordinates: [position.lat, position.lng],
      };

      try {
        const response = await createCoordinate(coordData);
        if (response.success) {
          const coordId = response.coordinate?.coordinate._id;
          if (coordId) {
            setCoordinates({
              ...coordinates,
              [coordId]: {
                type: response.coordinate?.coordinate.type,
                coordinates: response.coordinate?.coordinate.coordinates,
                name: response.coordinate?.coordinate.name,
              },
            });
            setSelectedCoordId(coordId);
          }
          return coordId;
        } else {
          showToastMessage('Failed to create coordinate', 'error');
        }
      } catch (error) {
        showToastMessage('Error creating coordinate:' + error, 'error');
      }
    }
  }

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
              popupRef.current?.remove();
              featureGroupRef.current?.remove();
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
              handleAddCoordinate={handleAddPoint}
            />
          )}

          <DrawingPanel 
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            setSelectedCoordId={setSelectedCoordId}
            setPosition={setPosition}
            setCoordName={setCoordName}
            featureGroupRef={featureGroupRef}
            popupRef={popupRef}
          />

          {selectedCoordId &&
            coordinates[selectedCoordId]['type'] == 'Polygon' && (
              <Polygon
                pathOptions={{
                  color: mapType == 'sat' ? satMapMainColor : swedishFlagBlue,
                }}
                positions={coordinates[selectedCoordId]['coordinates']}
              ></Polygon>
            )
          }

          <MapClickHandler />
          
        </CustomMap>

      </div>
    </div>
  );
};

export default MapSection;
