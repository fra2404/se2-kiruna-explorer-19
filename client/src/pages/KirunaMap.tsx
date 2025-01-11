import { useState, useEffect, useContext } from 'react';
import { DivIcon, LatLng } from 'leaflet';
import API from '../API';
import FeedbackContext from '../context/FeedbackContext';
import MapStyleContext from '../context/MapStyleContext';

import { useAuth } from '../context/AuthContext';
import Overlay from '../components/organisms/Overlay/Overlay';
import { Point } from '../components/organisms/coordsOverlay/Point';
import ClickMarker from '../components/organisms/coordsOverlay/ClickMarker';
import { Header } from '../components/organisms/Header';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { ManageCoordsModal } from '../components/organisms/modals/ManageCoordsModal';
import { renderToString } from 'react-dom/server';
import { UserRoleEnum } from '../utils/interfaces/user.interface';
import CustomMap from '../components/molecules/CustomMap';
import useDocuments from '../utils/hooks/documents';
import Legend2 from '../components/molecules/legend/Legend';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

import './KirunaMap.css'; // Importa il file CSS

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
  const { isLoggedIn, user } = useAuth();
  const { setFeedbackFromError } = useContext(FeedbackContext);
  const { swedishFlagBlue, swedishFlagYellow } = useContext(MapStyleContext);

  const [coordinates, setCoordinates] = useState({});
  const [legendOpen, setLegendOpen] = useState(false); // Stato per gestire la visibilità della legenda

  const { allDocuments, setAllDocuments, filteredDocuments, setFilteredDocuments } = useDocuments();

  // Manages the coords modal
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
      <Header
        page="map"
        setManageCoordsModalOpen={setManageCoordsModalOpen}
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        allDocuments={allDocuments}
        setAllDocuments={setAllDocuments}
        filteredDocuments={filteredDocuments}
        setFilteredDocuments={setFilteredDocuments}
      />

            <button
        onClick={() => setLegendOpen(!legendOpen)}
        className={`bg-black text-white text-base pt-2 pb-2 pl-3 pr-3 rounded-full ${legendOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          bottom: legendOpen ? '31vh' : '10px', //Moves the button above the legend window when it's open
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          transition: 'bottom 0.3s ease-out', // Adds the transition
        }}
      >
        {legendOpen ? '↓' : '↑'}
      </button>

      <Legend2 isOpen={legendOpen} />

      <Overlay
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        documents={allDocuments}
        setDocuments={setAllDocuments}
        filteredDocuments={filteredDocuments}
        setFilteredDocuments={setFilteredDocuments}
      />

      <CustomMap>
        <MarkerClusterGroup
          iconCreateFunction={(cluster: any) => {
            let nDocuments = 0;
            cluster.getAllChildMarkers().forEach((m: any) => {
              nDocuments += m.options.children[0].props.markerDocuments.length;
            });
            return new DivIcon({
              iconSize: [45, 45],
              className: 'pointIcon',
              html: renderToString(
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '40px',
                    height: '40px',
                    backgroundColor: swedishFlagYellow,
                    color: swedishFlagBlue,
                    borderRadius: '50%',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  {nDocuments}
                </div>,
              ),
            });
          }}
        >
          {Object.entries(coordinates).map(([coordId, coordInfo]: any) => {
            const coordDocuments = filteredDocuments.filter(
              (d) => d.coordinates?._id == coordId,
            );
            if (coordDocuments.length > 0) {
              return (
                <Point
                  key={coordId}
                  id={coordId}
                  pointCoordinates={coordInfo.coordinates}
                  name={coordInfo.name}
                  type={coordInfo.type}
                  coordinates={coordinates}
                  setCoordinates={setCoordinates}
                  pointDocuments={coordDocuments}
                  allDocuments={allDocuments}
                  setAllDocuments={setAllDocuments}
                  filteredDocuments={filteredDocuments}
                  setFilteredDocuments={setFilteredDocuments}
                />
              );
            }
          })}
        </MarkerClusterGroup>

        {isLoggedIn && user && (user.role === UserRoleEnum.Uplanner || user.role === UserRoleEnum.Udeveloper) && (
          <ClickMarker
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            documents={allDocuments}
            setDocuments={setAllDocuments}
            filteredDocuments={filteredDocuments}
            setFilteredDocuments={setFilteredDocuments}
          />
        )}

        <ManageCoordsModal
          manageCoordsModalOpen={manageCoordsModalOpen}
          setManageCoordsModalOpen={setManageCoordsModalOpen}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          documents={allDocuments}
        />
      </CustomMap>
    </div>
  );
}