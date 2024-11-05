import { useState, useEffect, useContext, useRef } from 'react';
import {
    MapContainer,
    TileLayer,
    ZoomControl,
    Popup,
    useMapEvents,
} from 'react-leaflet';
import { LatLng, LatLngExpression } from 'leaflet';
import API from '../API';
import FeedbackContext from '../context/FeedbackContext';
import Header from './Header';
import Markers from './Markers';
import Areas from './Areas';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import 'leaflet/dist/leaflet.css';
import { ButtonRounded } from './Button';
import DocumentForm from './DocumentForm';
import Modal from 'react-modal';
import Overlay from './Overlay';

export const kirunaLatLngCoords: LatLngExpression = [67.85572, 20.22513]; // this are DD coordinates for Kiruna different from DMS coordinates for Kiruna

export const modalStyles = {
    //Styles for the DocumentForm modal
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
    const { isLoggedIn, user } = useAuth(); // Retrieve this information from the context created by FAL
    const { setFeedbackFromError } = useContext(FeedbackContext); // this context is used to handle errors during the navigation+

    const [documents, setDocuments] = useState([]); // state to save a list of documents
    const [coordinates, setCoordinates] = useState({}); //State to save a listo of coordinates (areas and points)
    const [shouldRefresh, setShouldRefresh] = useState(true); // useState is used to force a re-render of the map container

    //Retreive areas and points from BE and save them in a structure.
    useEffect(() => {
        API.getCoordinates()
            .then((coords) => {
                let result: {
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
        // If the user is logged in
        // Retrieve the documents from the backend and save them in the state
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
                {' '}
                {/* This is needed to avoid glitch in the visualization of the map */}
                <Header />
                <Overlay></Overlay>
                <MapContainer
                    style={{ width: '100%', height: '100%' }}
                    center={kirunaLatLngCoords}
                    zoom={13}
                    doubleClickZoom={false}
                    scrollWheelZoom={true} // Enable the scroll wheel zoom
                    zoomControl={false} // Disable the zoom control, we will use a custom one
                    touchZoom={true} //Touch capabilities for smartphones. TODO: It needs to be tested
                    maxBounds={[
                        [67.8, 19.9],
                        [67.9, 20.5],
                    ]} // Limit the map dimension to Kiruna area
                    maxBoundsViscosity={0.9}
                >
                    {' '}
          // It gives a "rubber band" effect when you try to move the map
                    outside the bounds
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        //Component that handles markers (both areas and points)
                        Object.entries(coordinates).map(([coordId, coordInfo]: any) => {
                            if (coordInfo.type == 'Point') {
                                return (
                                    <Markers
                                        key={coordId}
                                        id={coordId}
                                        pointCoordinates={coordInfo.coordinates}
                                        name={coordInfo.name}
                                        coordinates={coordinates}
                                        isLoggedIn={isLoggedIn}
                                    />
                                );
                            } else {
                                return (
                                    <Areas
                                        key={coordId}
                                        id={coordId}
                                        areaCoordinates={coordInfo.coordinates}
                                        name={coordInfo.name}
                                        coordinates={coordinates}
                                        isLoggedIn={isLoggedIn}
                                    />
                                );
                            }
                        })
                    }
                    {isLoggedIn && <ClickMarker coordinates={coordinates} />}
                    <ZoomControl position="bottomleft" />
                </MapContainer>
            </div>
        </>
    );
}

interface ClickMarkerProps {
    coordinates: any;
}

function ClickMarker({ coordinates }: ClickMarkerProps) {
    const [position, setPosition] = useState<LatLng | null>(null);
    useMapEvents({
        dblclick(e) {
            setPosition(e.latlng);
        },
    });
    const popupRef = useRef<L.Popup>(null);

    //Modal options
    // const [modalOpen, setModalOpen] = useState(false);
    const { modalOpen, setModalOpen } = useModal();

    return position === null ? null : (
        <>
            <Popup ref={popupRef} position={position}>
                <span className="text-base">
                    Do you want to add a document in this position?
                </span>
                <br />
                <br />
                <div className="flex justify-between">
                    <ButtonRounded
                        variant="filled"
                        text="Yes"
                        className="bg-black text-white text-base pt-2 pb-2 pl-3 pr-3"
                        onClick={() => {
                            setModalOpen(true);
                        }}
                    />
                    <ButtonRounded
                        variant="outlined"
                        text="Cancel"
                        className="text-base pt-2 pb-2 pl-3 pr-3"
                        onClick={() => {
                            popupRef.current?.remove();
                            setPosition(null);
                        }}
                    />
                </div>
            </Popup>
            <Modal
                style={modalStyles}
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
            >
                <DocumentForm
                    coordinates={coordinates}
                    positionProp={position}
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                />
            </Modal>
        </>
    );
}
