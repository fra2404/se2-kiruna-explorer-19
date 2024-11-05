import { LatLng } from "leaflet";
import { Polygon, Popup } from "react-leaflet";
import { ButtonRounded } from "./Button";
import { useRef, useState } from "react";
import Modal from "react-modal";
import DocumentForm from "./DocumentForm";
import { modalStyles } from "./Map";

interface AreaProps {
    isLoggedIn: boolean,
    id: string,
    areaCoordinates: LatLng[],
    name: string,
    coordinates: any
}

export default function Areas({id, areaCoordinates, name, coordinates, isLoggedIn}: AreaProps) {
    const [selectedAreaId, setSelectedAreaId] = useState("");

    const popupRef = useRef<L.Popup>(null);

    //Modal options
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Polygon key={id} pathOptions={{color: "blue"}} positions={areaCoordinates as unknown as LatLng[]}>
                <Popup ref={popupRef}>
                    <span className="text-lg font-bold">{name}</span><br />
                    {isLoggedIn && 
                    <>
                        <span className='text-base'>Do you want to add a document in this area?</span><br />
                        <div className='flex justify-between'>
                            <ButtonRounded variant="filled" text="Yes" className="bg-black text-white text-base pt-2 pb-2 pl-3 pr-3" onClick={() => {setSelectedAreaId(id); setModalOpen(true);}}/>
                            <ButtonRounded variant="outlined" text="Cancel" className="text-base pt-2 pb-2 pl-3 pr-3" onClick={() => {popupRef.current?.remove()}}/>
                        </div>
                    </>
                    }
                </Popup>
            </Polygon>
            <Modal style={modalStyles} isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
                <DocumentForm coordinates={coordinates} selectedCoordIdProp={selectedAreaId} />
            </Modal>
        </>
    )
}