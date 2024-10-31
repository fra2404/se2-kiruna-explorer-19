/**
 * Component for displaying all the markers on the map
 */

import { useState, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { DivIcon, Icon } from 'leaflet';
import AgreementIcon from "../assets/icons/agreement-icon";
import { renderToString } from "react-dom/server";
import ConflictIcon from "../assets/icons/conflict-icon";
import ConsultationIcon from "../assets/icons/consultation-icon";
import DesignDocIcon from "../assets/icons/design-doc-icon";
import InformativeDocIcon from "../assets/icons/informative-doc-icon";
import MaterialEffectsIcon from "../assets/icons/material-effects-icon";
import PrescriptiveDocIcon from "../assets/icons/prescriptive-doc-icon";
import TechnicalDocIcon from "../assets/icons/technical-doc-icon";

// Function to get the appropriate icon for a category, with the right color according to stakeholders
const getCategoryIcon = (category: string, fillColor: string) => {
    //Define custom icons for different categories
    if (category === 'agreement') {
        return new DivIcon({
            iconSize: [35, 35], // size of the icon
            className: "agreementIcon",
            html: renderToString(<AgreementIcon fillColor={fillColor} />)
        });
    } else if (category === 'conflict') {
        return new DivIcon({
            iconSize: [35, 35], // size of the icon
            className: "conflictIcon",
            html: renderToString(<ConflictIcon fillColor={fillColor}/>)
        });
    } else if (category === 'consultation') {
        return new DivIcon({
            iconSize: [35, 35], // size of the icon
            className: "consultationIcon",
            html: renderToString(<ConsultationIcon fillColor={fillColor}/>)
        });
    } else if (category === 'designDoc') {
        return new DivIcon({
            iconSize: [35, 35], // size of the icon
            className: "designDocIcon",
            html: renderToString(<DesignDocIcon fillColor={fillColor}/>)
        });
    } else if (category === 'informativeDoc') {
        return new DivIcon({
            iconSize: [35, 35], // size of the icon
            className: "informativeDocIcon",
            html: renderToString(<InformativeDocIcon fillColor={fillColor}/>)
        });
    } else if (category === 'materialEffects') {
        return new DivIcon({
            iconSize: [35, 35], // size of the icon
            className: "materialEffectsIcon",
            html: renderToString(<MaterialEffectsIcon fillColor={fillColor}/>)
        });
    } else if (category === 'prescriptiveDoc') {
        return new DivIcon({
            iconSize: [35, 35], // size of the icon
            className: "prescriptiveDocIcon",
            html: renderToString(<PrescriptiveDocIcon fillColor={fillColor}/>)
        });
    } else if (category === 'technicalDoc') {
        return new DivIcon({
            iconSize: [35, 35], // size of the icon
            className: "technicalDocIcon",
            html: renderToString(<TechnicalDocIcon fillColor={fillColor}/>)
        });
    } else {
        // Default icon if category doesn't match any of the above
        new Icon({
            iconUrl: 'path/to/icon.png',
            iconSize: [38, 45] // size of the icon
        })
    }
};






export default function Markers() {
    const [documents, setDocuments] = useState([
        {latitude: 67.857443, longitude: 20.230131, title: "Document 1", category: "conflict"},
        {latitude: 67.849019, longitude: 20.218337, title: "Document 2", category: "agreement"},
        {latitude: 67.834257, longitude: 20.285673, title: "Document 3", category: "designDoc"},
        {latitude: 67.860667, longitude: 20.287734, title: "Document 4", category: "technicalDoc"},
    ]);

    /*useEffect(() => {
        // Fetch agency data from the server
        fetch('/documents') // TODO: example of endpoint. I don't know yet the real one.
            .then(response => response.json())
            .then(documents => setDocuments(documents));
    }, []);*/


    // Create an array of document coordinates with additional information
    const documentsCoordinates = documents.map(document => ({
        latitude: document.latitude,
        longitude: document.longitude,
        title: document.title,
        category: document.category,
        icon: getCategoryIcon(document.category, "black"),      //TODO: change second parameter to match stakeholder's colors for that document
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




