/**
 * Component for displaying all the markers on the map
 */

import { useRef, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { DivIcon, Icon, LatLng } from 'leaflet';
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




interface MarkersProps {
    id: string,
    pointCoordinates: LatLng,
    name: string,
    coordinates: any,
    isLoggedIn: boolean
}

export default function Markers({id, pointCoordinates, name, coordinates, isLoggedIn}: MarkersProps) {
    const [modalOpen, setModalOpen] = useState(false);

    const [selectedPointId, setSelectedPointId] = useState("");

    const popupRef = useRef<L.Popup>(null);

    return (
        <>
            <Marker
                key={id}
                position={pointCoordinates}
                //icon={document.icon} // Use the selected icon
            >
                <Popup>
                    <span className="text-lg font-bold">{name}</span><br />
                    {isLoggedIn && 
                    <>
                        <span className='text-base'>Do you want to add a document in this point?</span><br /><br />
                        <div className='flex justify-between'>
                            <ButtonRounded variant="filled" text="Yes" className="bg-black text-white text-base pt-2 pb-2 pl-3 pr-3" onClick={() => {setSelectedPointId(id); setModalOpen(true);}}/>
                            <ButtonRounded variant="outlined" text="Cancel" className="text-base pt-2 pb-2 pl-3 pr-3" onClick={() => {popupRef.current?.remove()}}/>
                        </div>
                    </>
                    }
                </Popup>
            </Marker>

            <Modal style={modalStyles} isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
                <DocumentForm coordinates={coordinates} selectedCoordIdProp={selectedPointId} />
            </Modal>
        </>
    )
}




