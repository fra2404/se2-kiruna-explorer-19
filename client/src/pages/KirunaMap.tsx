import { useState, useEffect, useContext } from 'react';
import { TileLayer } from 'react-leaflet';
import { DivIcon, LatLng } from 'leaflet';
import API from '../API';
import FeedbackContext from '../context/FeedbackContext';
import MapStyleContext from '../context/MapStyleContext';

import { useAuth } from '../context/AuthContext';
import 'leaflet/dist/leaflet.css';
import Overlay from '../components/organisms/Overlay/Overlay';
import { Point } from '../components/organisms/coordsOverlay/Point';
import { Area } from '../components/organisms/coordsOverlay/Area';
import ClickMarker from '../components/organisms/coordsOverlay/ClickMarker';
import CustomZoomControl from '../components/molecules/ZoomControl';
import { Header } from '../components/organisms/Header';
import { IDocument } from '../utils/interfaces/document.interface';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { ManageCoordsModal } from '../components/organisms/modals/ManageCoordsModal';
import { renderToString } from 'react-dom/server';
import { UserRoleEnum } from '../utils/interfaces/user.interface';
import CustomMap from '../components/molecules/CustomMap';

export const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '95vh',
    maxHeight: '90vh'
  },
  overlay: { zIndex: 1000 },
};

export default function KirunaMap() {
  const { isLoggedIn, user } = useAuth();
  const { setFeedbackFromError } = useContext(FeedbackContext);
  const { swedishFlagBlue, swedishFlagYellow, mapType } = useContext(MapStyleContext);

  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [coordinates, setCoordinates] = useState({});
  const [shouldRefresh, setShouldRefresh] = useState(true);

  //Manages the coords modal
  const [manageCoordsModalOpen, setManageCoordsModalOpen] = useState(false);

  useEffect(() => {
    API.getCoordinates()
      .then((coords) => {
        const result: {
          [id: string]: {
            type: string;
            coordinates: LatLng | LatLng[] | LatLng[][];
            name: string;
          };
        } = {};
        coords.forEach(
          (c: {
            _id: string;
            type: string;
            coordinates: LatLng | LatLng[] | LatLng[][];
            name: string;
          }) => {
            result[c._id] = {
              type: c.type,
              coordinates: c.coordinates,
              name: c.name,
            };
          },
        );
        setCoordinates(result);
      })
      .catch((e) => {
        console.log(e);
        setFeedbackFromError(e);
      });
  }, []);

  useEffect(() => {
    API.getDocuments()
      .then((documents) => {
        setDocuments(documents);
      })
      .then(() => setShouldRefresh(false))
      .catch((e) => setFeedbackFromError(e));
  }, [shouldRefresh]);

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ width: width, height: height }}>
      <Header setManageCoordsModalOpen={setManageCoordsModalOpen} />

      {(isLoggedIn && user && user.role === UserRoleEnum.Uplanner) &&
        <Overlay 
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          documents={documents}
          setDocuments={setDocuments} />
      }

      <CustomMap>
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
                }}>
                {cluster.getChildCount()}
              </div>
            ),
          });
        }}>
          {Object.entries(coordinates).map(([coordId, coordInfo]: any) => {
            const filteredDocuments = documents.filter((d) => d.coordinates?._id == coordId);

            if (coordInfo.type == 'Point') {
              if (filteredDocuments.length > 0) {
                return (
                  <Point
                    key={coordId}
                    id={coordId}
                    pointCoordinates={coordInfo.coordinates}
                    name={coordInfo.name}
                    coordinates={coordinates}
                    setCoordinates={setCoordinates}
                    pointDocuments={filteredDocuments}
                    allDocuments={documents}
                    setDocuments={setDocuments}
                  />
                );
              }
            } else {
              if(filteredDocuments.length > 0) {
                return (
                  <Area
                    key={coordId}
                    id={coordId}
                    areaCoordinates={coordInfo.coordinates}
                    name={coordInfo.name}
                    coordinates={coordinates}
                    setCoordinates={setCoordinates}
                    areaDocuments={filteredDocuments}
                    allDocuments={documents}
                    setDocuments={setDocuments}
                  />
                );
              }
            }
          })}
        </MarkerClusterGroup>

        {(isLoggedIn && user && user.role === UserRoleEnum.Uplanner) &&
          <ClickMarker 
            coordinates={coordinates}
            setCoordinates={setCoordinates} 
            documents={documents}
            setDocuments={setDocuments} />
        }

        <CustomZoomControl />

        <ManageCoordsModal 
          manageCoordsModalOpen={manageCoordsModalOpen}
          setManageCoordsModalOpen={setManageCoordsModalOpen}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          documents={documents} />
      </CustomMap>
    </div>
  );
}
