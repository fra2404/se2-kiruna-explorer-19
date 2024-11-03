/**
 * Component for displaying all the markers on the map
 */

import { useState } from "react";
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
import { ButtonRounded } from "./Button";
import Modal from "react-modal";
import DocumentForm from "./DocumentForm";
import { modalStyles } from "./Map";

// Function to get the appropriate icon for a type, with the right color according to stakeholders
const getTypeIcon = (type: string, fillColor: string) => {
    //Define custom icons for different categories
    if (type === 'Agreement') {
        return new DivIcon({
            iconSize: [35, 35], // size of the icon
            className: "agreementIcon",
            html: renderToString(<AgreementIcon fillColor={fillColor} />)
        });
    } else if (type === 'Conflict') {
        return new DivIcon({
            iconSize: [35, 35], // size of the icon
            className: "conflictIcon",
            html: renderToString(<ConflictIcon fillColor={fillColor}/>)
        });
    } else if (type === 'Consultation') {
        return new DivIcon({
            iconSize: [35, 35], // size of the icon
            className: "consultationIcon",
            html: renderToString(<ConsultationIcon fillColor={fillColor}/>)
        });
    } else if (type === 'Design document') {
        return new DivIcon({
            iconSize: [35, 35], // size of the icon
            className: "designDocIcon",
            html: renderToString(<DesignDocIcon fillColor={fillColor}/>)
        });
    } else if (type === 'Informative document') {
        return new DivIcon({
            iconSize: [35, 35], // size of the icon
            className: "informativeDocIcon",
            html: renderToString(<InformativeDocIcon fillColor={fillColor}/>)
        });
    } else if (type === 'Material effects') {
        return new DivIcon({
            iconSize: [35, 35], // size of the icon
            className: "materialEffectsIcon",
            html: renderToString(<MaterialEffectsIcon fillColor={fillColor}/>)
        });
    } else if (type === 'Prescriptive document') {
        return new DivIcon({
            iconSize: [35, 35], // size of the icon
            className: "prescriptiveDocIcon",
            html: renderToString(<PrescriptiveDocIcon fillColor={fillColor}/>)
        });
    } else if (type === 'Technical document') {
        return new DivIcon({
            iconSize: [35, 35], // size of the icon
            className: "technicalDocIcon",
            html: renderToString(<TechnicalDocIcon fillColor={fillColor}/>)
        });
    } else {
        // Default icon if type doesn't match any of the above
        new Icon({
            iconUrl: 'path/to/icon.png',
            iconSize: [38, 45] // size of the icon
        })
    }
};






export default function Markers(props: any) {
    const [documents, setDocuments] = useState([
        {latitude: 67.857443, longitude: 20.230131, title: "Document 1", type: "Conflict"},
        {latitude: 67.849019, longitude: 20.218337, title: "Document 2", type: "Agreement"},
        {latitude: 67.834257, longitude: 20.285673, title: "Document 3", type: "Design document"},
        {latitude: 67.860667, longitude: 20.287734, title: "Document 4", type: "Technical document"},
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
        type: document.type,
        icon: getTypeIcon(document.type, "black"),      //TODO: change second parameter to match stakeholder's colors for that document
    }));

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument]: any = useState({});

    return (
        <>
            {documentsCoordinates.map((document, index) => (
                <>
                    <Marker
                        key={index}
                        position={[document.latitude, document.longitude]}
                        icon={document.icon} // Use the selected icon
                    >
                        <Popup>
                            <span className="text-lg font-bold">{document.title}</span><br />
                            <span className="text-base">Type: {document.type}</span><br /><br />
                            <div className="flex justify-center">
                                <ButtonRounded variant="filled" text="See details" className="bg-black text-white text-base pt-2 pb-2 pl-3 pr-3" onClick={() => {setSelectedDocument(document); setModalOpen(true);}}/>
                            </div>
                        </Popup>
                    </Marker>

                    <Modal style={modalStyles} isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
                        <DocumentForm selection="position" areas={props.areasCoords} position={ [selectedDocument.latitude, selectedDocument.longitude]} selectedDocument={selectedDocument} />
                    </Modal>
                </>
            ))}
        </>
    )
}




