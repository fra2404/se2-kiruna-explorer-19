import { LatLng, LatLngExpression } from "leaflet";
import { Polygon, Popup, useMap } from "react-leaflet";
import { ButtonRounded } from "./Button";
import { useRef, useState } from "react";
import Modal from "react-modal";
import DocumentForm from "./DocumentForm";

export default function Areas(props: any) {
    const [selectedAreaId, setSelectedAreaId] = useState("");

    const popupRef = useRef<L.Popup>(null);

    //Modal options
    const [modalOpen, setModalOpen] = useState(false);
    const modalStyles = {
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

    const areas = Object.entries(props.areasCoords).map(([areaId,info]: [string, any]) => {
        return (
            <>
                <Polygon key={areaId} pathOptions={{color: "blue"}} positions={info["coords"] as unknown as LatLng[]}>
                    <Popup ref={popupRef}>
                        <span className="text-lg font-bold">{info["name"]}</span><br /><br />
                        <span className='text-base'>Do you want to add a document in this area?</span><br /><br />
                        <div className='flex justify-between'>
                            <ButtonRounded variant="outlined" text="Yes" className="bg-black text-white text-base pt-2 pb-2 pl-3 pr-3" onClick={() => {setSelectedAreaId(areaId); setModalOpen(true);}}/>
                            <ButtonRounded variant="outlined" text="Cancel" className="text-base pt-2 pb-2 pl-3 pr-3" onClick={() => {popupRef.current?.remove()}}/>
                        </div>
                    </Popup>
                </Polygon>
                <Modal style={modalStyles} isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
                    <DocumentForm areas={props.areasCoords} selection="area" selectedAreaId={selectedAreaId} />
                </Modal>
            </>
        )
    });

    return areas;
}