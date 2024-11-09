import { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLng, LatLngExpression } from 'leaflet';
import API from '../API';
import FeedbackContext from '../context/FeedbackContext';

import { useAuth } from '../context/AuthContext';
import 'leaflet/dist/leaflet.css';
import Overlay from '../components/organisms/Overlay/Overlay';
import { Point } from '../components/organisms/Point';
import { Area } from '../components/organisms/Area';
import ClickMarker from '../components/organisms/ClickMarker';
import CustomZoomControl from '../components/molecules/ZoomControl';
import Header from '../components/organisms/Header';

export const kirunaLatLngCoords: LatLngExpression = [67.85572, 20.22513];

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
    maxHeight: '90vh',
  },
  overlay: { zIndex: 1000 },
};

export default function KirunaMap() {
  const { isLoggedIn } = useAuth();
  const { setFeedbackFromError } = useContext(FeedbackContext);

  const [documents, setDocuments] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [shouldRefresh, setShouldRefresh] = useState(true);

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
    <>
      <div style={{ width: width, height: height }}>
        <Header />
        {isLoggedIn && <Overlay coordinates={coordinates} />}
        <MapContainer
          style={{ width: '100%', height: '100%' }}
          center={kirunaLatLngCoords}
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
          {Object.entries(coordinates).map(([coordId, coordInfo]: any) => {
            const filteredDocuments = documents.filter((d) => d["coordinates"]["_id"] == coordId);

            if (coordInfo.type == 'Point') {
              return (
                <Point
                  key={coordId}
                  id={coordId}
                  pointCoordinates={coordInfo.coordinates}
                  name={coordInfo.name}
                  coordinates={coordinates}
                  isLoggedIn={isLoggedIn}
                  documents={filteredDocuments}
                />
              );
            } else {
              return (
                <Area
                  key={coordId}
                  id={coordId}
                  areaCoordinates={coordInfo.coordinates}
                  name={coordInfo.name}
                  coordinates={coordinates}
                  isLoggedIn={isLoggedIn}
                  documents={filteredDocuments}
                />
              );
            }
          })}
          {isLoggedIn && <ClickMarker coordinates={coordinates} />}
          <CustomZoomControl />
        </MapContainer>
      </div>
    </>
  );
}
