import { useState, useEffect, useContext, useRef } from 'react';
import { MapContainer, TileLayer, ZoomControl, Popup, useMapEvents } from 'react-leaflet';
import { LatLng, LatLngExpression } from 'leaflet';
import API from '../API';
import FeedbackContext from '../context/FeedbackContext';
import Header from './Header';
import Markers from './Markers';
import Areas from './Areas';
import { useAuth } from '../context/AuthContext';
import "leaflet/dist/leaflet.css";
import { ButtonRounded } from './Button';
import DocumentForm from './DocumentForm';
import Modal from "react-modal";

export const kirunaLatLngCoords: LatLngExpression = [67.85572, 20.22513];   // this are DD coordinates for Kiruna different from DMS coordinates for Kiruna

export const modalStyles = {                                                //Styles for the DocumentForm modal
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
    overlay: {zIndex: 1000}
}

export default function KirunaMap() {
    const { isLoggedIn, user } = useAuth();   // Retrieve this information from the context created by FAL
    const { setFeedbackFromError } = useContext(FeedbackContext);   // this context is used to handle errors during the navigation

    const [documents, setDocuments] = useState([]); // state to save a list of documents
    const [shouldRefresh, setShouldRefresh] = useState(true);   // useState is used to force a re-render of the map container

    //Hard coded areas, will be retrieved from the backend when we will have it
    const areasCoords = {
        "A1": {
            "name": "City center",
            "coords": [[67.854844, 20.243384], [67.849990, 20.243727], [67.850702, 20.266230], [67.857173, 20.265538]],
        },
        "A2": {
            "name": "Luossajarvi",
            "coords": [[67.862737, 20.186711], [67.868170, 20.166441], [67.877093, 20.165441], [67.874507, 20.186398], [67.866747, 20.198250]],
        },
        "A3": {
            "name": "Kiirunavaaragruvan",
            "coords": [[67.839309, 20.214946], [67.833351, 20.225252], [67.833092, 20.203952]]
        }
    };

    useEffect(() => { // If the user is logged in
        // Retrieve the documents from the backend and save them in the state
        API.getDocuments()
            .then((documents) => {
                setDocuments(documents)
            })
            .then(() => setShouldRefresh(false))
            .catch(e => setFeedbackFromError(e));
    }, [shouldRefresh]);

    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <div style={{ width: width, height: height }}>  {/* This is needed to avoid glitch in the visualization of the map */}

                <Header />
                <MapContainer
                    style={{ width: "100%", height: "100%" }}
                    center={kirunaLatLngCoords}
                    zoom={13}
                    doubleClickZoom={false}
                    scrollWheelZoom={true}  // Enable the scroll wheel zoom
                    zoomControl={false}   // Disable the zoom control, we will use a custom one
                    touchZoom={true}    //Touch capabilities for smartphones. TODO: It needs to be tested

                    maxBounds={[[67.800, 19.900], [67.900, 20.500]]}    // Limit the map dimension to Kiruna area
                    maxBoundsViscosity={0.9}>    // It gives a "rubber band" effect when you try to move the map outside the bounds
                
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                    <Areas areasCoords={areasCoords} />

                    {/* Here there go a component that handles all the markers */}
                    <Markers areasCoords={areasCoords}/>
                    <ClickMarker areasCoords={areasCoords} />
                    
                    <ZoomControl position="bottomleft" />
                </MapContainer>
            </div>
        </>
    );
}

function ClickMarker(props: any) {
    const [position, setPosition] = useState<LatLng | null>(null);
    useMapEvents({
        dblclick(e) {
            setPosition(e.latlng);
        }
    });
    const popupRef = useRef<L.Popup>(null);

    //Modal options
    const [modalOpen, setModalOpen] = useState(false);

    return position === null ? null : (
        <>
            <Popup ref={popupRef} position={position}>
                <span className='text-base'>Do you want to add a document in this position?</span><br /><br />
                <div className='flex justify-between'>
                    <ButtonRounded variant="filled" text="Yes" className="bg-black text-white text-base pt-2 pb-2 pl-3 pr-3" onClick={() => {setModalOpen(true);}}/>
                    <ButtonRounded variant="outlined" text="Cancel" className="text-base pt-2 pb-2 pl-3 pr-3" onClick={() => {popupRef.current?.remove(); setPosition(null); }}/>
                </div>
            </Popup>
            <Modal style={modalStyles} isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
                <DocumentForm selection="position" areas={props.areasCoords} position={position} />
            </Modal>
        </>
    )
}