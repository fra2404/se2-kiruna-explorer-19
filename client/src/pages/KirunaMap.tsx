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

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

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

  const { allDocuments, setAllDocuments, filteredDocuments, setFilteredDocuments } = useDocuments();

  //Manages the coords modal
  const [manageCoordsModalOpen, setManageCoordsModalOpen] = useState(false);

  //Manages the sidebar
  const [sidebarVisible, setSidebarVisible] = useState(false);

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
    <div style={{ 
        width: width,
        height: height
      }}
    >
      <Header 
        page='map'
        sidebarVisible={sidebarVisible}
        setSidebarVisible={setSidebarVisible}
        setManageCoordsModalOpen={setManageCoordsModalOpen}
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        allDocuments={allDocuments}
        setAllDocuments={setAllDocuments}
        filteredDocuments={filteredDocuments}
        setFilteredDocuments={setFilteredDocuments}
      />

        <Overlay 
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          documents={allDocuments}
          setDocuments={setAllDocuments}
          sidebarVisible={sidebarVisible}
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

        {isLoggedIn && user && user.role === UserRoleEnum.Uplanner && (
          <ClickMarker
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            documents={allDocuments}
            setDocuments={setAllDocuments}
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
