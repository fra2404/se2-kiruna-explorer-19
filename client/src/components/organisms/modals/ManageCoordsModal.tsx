import Modal from 'react-modal';
import { kirunaLatLngCoords } from '../../../pages/KirunaMap';
import { MapContainer, Marker, Polygon, TileLayer } from 'react-leaflet';
import { useContext, useRef } from 'react';
import MapStyleContext from '../../../context/MapStyleContext';
import CustomZoomControl from '../../molecules/ZoomControl';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { IDocument } from '../../../utils/interfaces/document.interface';
import { renderToString } from 'react-dom/server';
import { DivIcon } from 'leaflet';
import { DeleteCoordPopup } from '../../molecules/popups/DeleteCoordPopup';
import API from '../../../API';

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

  const {swedishFlagBlue, swedishFlagYellow, satMapMainColor, mapType} = useContext(MapStyleContext);
  const markerRef = useRef<L.Marker>(null);
  const polygonRef = useRef<L.Polygon>(null);

  return(
    <Modal
      style={manageCoordsModalStyles}
      isOpen={manageCoordsModalOpen}
      onRequestClose={() => setManageCoordsModalOpen(false)}
    >
      <div className="w-full rounded shadow-md border h-full">
        <MapContainer
          style={{ width: '100%', height: '100%', zIndex: 10 }}
          center={kirunaLatLngCoords}
          zoom={13}
          doubleClickZoom={false}
          scrollWheelZoom={true}
          minZoom={9}
          zoomControl={false}
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

              if (coordInfo.type == 'Point') {
                return (
                  <Marker
                    key={coordId}
                    position={ coordInfo.coordinates }
                    ref={markerRef}
                  >
                    <DeleteCoordPopup 
                      name={coordInfo.name}
                      message={
                        filteredDocuments.length == 0 ?
                          "Do you want to delete this point?"
                        : "There are documents associated to this point, you cannot delete it"
                      }
                      showButtons={filteredDocuments.length == 0}
                      onYesClick={async () => await onYesClick(markerRef, coordId, coordinates, setCoordinates)}
                      onCancelClick={() => {
                        markerRef.current?.closePopup();
                      }}
                    />
                  </Marker>
                );
              } else {
                return (
                  <Polygon
                    key={coordId}
                    pathOptions={{ color: mapType == "sat" ? satMapMainColor : swedishFlagBlue }}
                    positions={ coordInfo.coordinates }
                    ref={polygonRef}
                  >
                    <DeleteCoordPopup 
                      name={coordInfo.name}
                      message={
                        filteredDocuments.length == 0 ?
                          "Do you want to delete this area?"
                        : "There are documents associated to this area, you cannot delete it"
                      }
                      showButtons={filteredDocuments.length == 0}
                      onYesClick={async () => await onYesClick(polygonRef, coordId, coordinates, setCoordinates)}
                      onCancelClick={() => {
                        polygonRef.current?.closePopup();
                      }}
                    />
                  </Polygon>
                );
              }
            })}
          </MarkerClusterGroup>

          <CustomZoomControl />

        </MapContainer>
      </div>
    </Modal>
  );
}

async function onYesClick(
  ref: any,
  coordToDelete: string,
  coordinates: any,
  setCoordinates: (coordinates: any) => void
) {
  ref.current?.closePopup();
  const response = await API.deleteCoordinate(coordToDelete);
  if(response.success) {
    const {[coordToDelete]: _, ...coordinatesUpdated} = coordinates;
    console.log(coordinatesUpdated);
    setCoordinates(coordinatesUpdated);
  }
}