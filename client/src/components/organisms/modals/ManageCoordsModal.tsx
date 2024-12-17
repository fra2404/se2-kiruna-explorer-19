import Modal from 'react-modal';
import { useMapEvents } from 'react-leaflet';
import { useContext, useRef, useState } from 'react';
import MapStyleContext from '../../../context/MapStyleContext';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { ICoordinate, IDocument } from '../../../utils/interfaces/document.interface';
import { renderToString } from 'react-dom/server';
import { DivIcon, LatLng } from 'leaflet';
import { createCoordinate } from '../../../API';
import CustomMap from '../../molecules/CustomMap';
import DrawingPanel from '../../molecules/DrawingPanel';
import NamePopup from '../../molecules/popups/NamePopup';
import { ManageCoordsPoint } from '../coordsOverlay/ManageCoordsPoint';

interface ManageCoordsModalProps {
  manageCoordsModalOpen: boolean,
  setManageCoordsModalOpen: (manageCoordsModalOpen: boolean) => void,
  coordinates: any,
  setCoordinates: (coordinates: any) => void,
  documents: IDocument[]
}

export const ManageCoordsModal: React.FC<ManageCoordsModalProps> = ({
  manageCoordsModalOpen,
  setManageCoordsModalOpen,
  coordinates,
  setCoordinates,
  documents
}) => {
  const manageCoordsModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      height: '90vh',
    },
    overlay: { zIndex: 1000 },
  }

  const { swedishFlagBlue, swedishFlagYellow } = useContext(MapStyleContext);
  
  //Refs needed for area drawing
  const popupRef = useRef<L.Popup>(null);
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  // Georeferencing information
  const [position, setPosition] = useState<LatLng | undefined>(undefined);
  const [coordName, setCoordName] = useState('');
  const [coordNamePopupOpen, setCoordNamePopupOpen] = useState(false);

  function MapClickHandler() {
    useMapEvents({
      dblclick(e) {
        setPosition(e.latlng);
        setCoordNamePopupOpen(true);
      },
    });
    return null;
  }

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
          }
          return coordId;
        } else {
          console.log('Failed to create coordinate');
        }
      } catch (error) {
        console.log('Error creating coordinate:');
      }
    }
  }

  return(
    <Modal
      style={manageCoordsModalStyles}
      isOpen={manageCoordsModalOpen}
      onRequestClose={() => setManageCoordsModalOpen(false)}
    >
      <div className="w-full rounded shadow-md border h-full">
        <CustomMap>
          <MarkerClusterGroup iconCreateFunction={(cluster: any) => {
            return new DivIcon({
              iconSize: [45, 45],
              className: "pointIcon",
              html: renderToString(
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "40px",
                    height: "40px",
                    backgroundColor: swedishFlagYellow,
                    color: swedishFlagBlue,
                    borderRadius: "50%",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {cluster.getChildCount()}
                </div>
              ),
            });
          }}>
            {Object.entries(coordinates).map(([coordId, coordInfo]: any) => {
              const filteredDocuments = documents.filter((d) => d.coordinates?._id == coordId);
              
                return (
                  <ManageCoordsPoint
                    key={coordId}
                    id={coordId}
                    name={coordInfo.name}
                    pointCoordinates={coordInfo.coordinates}
                    type={coordInfo.type}
                    coordinates={coordinates}
                    setCoordinates={setCoordinates}
                    filteredDocuments={filteredDocuments}
                  />
                );
            })}
          </MarkerClusterGroup>

          {coordNamePopupOpen && position && (
            <NamePopup
              position={position}
              coordName={coordName}
              setCoordName={setCoordName}
              setCoordNamePopupOpen={setCoordNamePopupOpen}
              setPosition={setPosition}
              handleAddCoordinate={handleAddPoint}
            />
          )}

          <DrawingPanel 
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            setPosition={setPosition}
            setCoordName={setCoordName}
            featureGroupRef={featureGroupRef}
            popupRef={popupRef}
          />

          <MapClickHandler />
        </CustomMap>
      </div>
    </Modal>
  );
}