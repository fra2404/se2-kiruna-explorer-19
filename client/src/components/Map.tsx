import { useState, useEffect, useContext, SetStateAction, Dispatch } from 'react';
import { MapContainer, TileLayer, ZoomControl, Popup, useMapEvents, Marker } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L, { LatLng, LatLngExpression } from 'leaflet';
import API from '../API';
import FeedbackContext from '../contexts/FeedbackContext';
import Header from './Header';
import Markers from './Markers';
import Areas from './Areas';
import { ButtonRounded } from './Button';


export default function KirunaMap() {


    /* START MOCK */
    // Mock the useAuth function
    function useAuth(): { isLoggedIn: any; user: any; } {
        const [isLoggedIn, setIsLoggedIn] = useState(true)
        const [user, setUser] = useState("Mario Rossi")

        return { isLoggedIn, user }
    }
    /* END MOCK */


    const { isLoggedIn, user } = useAuth();   // Retrieve this information from the context created by FAL
    const { setFeedbackFromError } = useContext(FeedbackContext);   // this context is used to handle errors during the navigation
    const [documents, setDocuments] = useState([]); // state to save a list of documents


    const kirunaLatLngCoords: LatLngExpression = [67.85572, 20.22513];   // this are DD coordinates for Kiruna different from DMS coordinates for Kiruna

    const firstMarkerCoords: LatLngExpression = [67.857443, 20.230131];

    const [shouldRefresh, setShouldRefresh] = useState(true);   // useState is used to force a re-render of the map container


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
        <div style={{ width: width, height: height }}>   {/* This is needed to avoid glitch in the visualization of the map */}

            <Header></Header>
            <MapContainer
                style={{ width: "100%", height: "100%" }}
                center={kirunaLatLngCoords}
                zoom={13}
                doubleClickZoom={false}
                scrollWheelZoom={true}  // Enable the scroll wheel zoom
                zoomControl={false}   // Disable the zoom control, we will use a custom one
                touchZoom={true}    //Touch capabilities for smartphones. TODO: It needs to be tested

                maxBounds={[[67.800, 19.900], [67.900, 20.500]]}    // Limit the map dimension to Kiruna area
                maxBoundsViscosity={0.9}    // It gives a "rubber band" effect when you try to move the map outside the bounds
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Areas />

                {/* Here there go a component that handles all the markers */}
                <Markers />

                <ClickMarker />

                <ZoomControl position="bottomleft" />

            </MapContainer>
        </div>
    );
}

function ClickMarker() {
    const [position, setPosition] = useState<LatLng | null>(null);
    const map = useMapEvents({
        dblclick(e) {
            setPosition(e.latlng);
        }
    });

    return position === null ? null : (
        <Popup position={position}>
            <span className='text-base'>Do you want to add a document in this position?</span><br /><br />
            <div className='flex justify-between'>
                <ButtonRounded variant="outlined" text="Yes" className="bg-black text-white text-base pt-2 pb-2 pl-3 pr-3" onClick={() => {}}/>
                <ButtonRounded variant="outlined" text="Cancel" className="text-base pt-2 pb-2 pl-3 pr-3" onClick={() => {setPosition(null)}}/>
            </div>
        </Popup>
    )
}