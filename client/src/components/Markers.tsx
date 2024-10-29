/**
 * Component for displaying all the markers on the map
 */

import { useState, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

//Define custom icons for different categories
const agreementIcon = new Icon({
    iconUrl: 'path/to/icon.png',
    iconSize: [35, 35], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor

})
const conflictIcon = new Icon({
    iconUrl: 'path/to/icon.png',
    iconSize: [35, 35], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
})
const consultationIcon = new Icon({
    iconUrl: 'path/to/icon.png',
    iconSize: [35, 35], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
})

const designDocIcon = new Icon({
    iconUrl: 'path/to/icon.png',
    iconSize: [38, 45], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
})

const informativeDocIcon = new Icon({
    iconUrl: 'path/to/icon.png',
    iconSize: [38, 45], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
})

const materialEffectsIcon = new Icon({
    iconUrl: 'path/to/icon.png',
    iconSize: [38, 45], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
})

const prescriptiveDocIcon = new Icon({
    iconUrl: 'path/to/icon.png',
    iconSize: [38, 45], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
})

const technicalDocIcon = new Icon({
    iconUrl: 'path/to/icon.png',
    iconSize: [38, 45], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
})

const defaultIcon = new Icon({
    iconUrl: 'path/to/icon.png',
    iconSize: [38, 45], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
})


// Function to get the appropriate icon for a category
const getCategoryIcon = category => {
    if (category === 'agreement') {
        return agreementIcon;
    } else if (category === 'conflict') {
        return conflictIcon;
    } else if (category === 'consultation') {
        return consultationIcon;
    } else if (category === 'designDoc') {
        return designDocIcon;
    } else if (category === 'informativeDoc') {
        return informativeDocIcon;
    } else if (category === 'materialEffects') {
        return materialEffectsIcon;
    } else if (category === 'prescriptiveDoc') {
        return prescriptiveDocIcon;
    } else if (category === 'technicalDoc') {
        return technicalDocIcon;
    } else {
        // Default icon if category doesn't match any of the above
        return defaultIcon; // Or another default icon
    }
};






export default function Markers() {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        // Fetch agency data from the server
        fetch('/documents') // TODO: example of endpoint. I don't know yet the real one.
            .then(response => response.json())
            .then(documents => setDocuments(documents));
    }, []);


    // Create an array of document coordinates with additional information
    const documentsCoordinates = documents.map(document => ({
        latitude: document.latitude,
        longitude: document.longitude,
        title: document.title,
        category: document.category,
        icon: getCategoryIcon(document.category),
    }));


    return (
        <>
            {documentsCoordinates.map((document, index) => (
                <Marker
                    key={index}
                    position={[document.latitude, document.longitude]}
                    icon={document.icon} // Use the selected icon
                >
                    <Popup>
                        <b>{document.title}</b><br />
                        Category: {document.category}<br />
                    </Popup>
                </Marker>
            ))}
        </>
    )
}




