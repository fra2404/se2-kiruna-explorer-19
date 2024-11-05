import { useState } from 'react';
import Select from 'react-select';
import ConnectionList from './ConnectionList';
import ConnectionForm from './ConnectionForm';
import { FaPlus } from 'react-icons/fa';
import Modal from "react-modal";
import { kirunaLatLngCoords } from './Map';
import { MapContainer, Marker, Polygon, TileLayer, useMapEvents, ZoomControl } from 'react-leaflet';
import { LatLng } from 'leaflet';
import InputComponent from './atoms/input/input';

Modal.setAppElement("#root");

export interface Connection {
  type: string;
  relatedDocument: string;
}

interface DocumentFormProps {
    positionProp?: LatLng,
    selectedCoordIdProp?: string,
    coordinates: any
}

const DocumentForm = ({positionProp, selectedCoordIdProp, coordinates}: DocumentFormProps) => {
    const stakeholdersOptions = [
        { value: "Kiruna Kommun", label: "Kiruna Kommun" },
        { value: "Kiruna Kommun / Residents", label: "Kiruna Kommun / Residents" },
        { value: "Kiruna Kommun / White Arkitekter", label: "Kiruna Kommun / White Arkitekter" },
        { value: "LKAB", label: "LKAB" }
    ];

    const documentTypeOptions = [
        { value: "Agreement", label: "Agreement" },
        { value: "Conflict", label: "Conflict" },
        { value: "Consultation", label: "Consultation" },
        { value: "Material effects", label: "Material effects" },
        { value: "Prescriptive document", label: "Prescriptive document" },
        { value: "Design document", label: "Design document" },
        { value: "Informative document", label: "Informative document" },
        { value: "Technical document", label: "Technical document" }
    ];

    const scaleTypeOptions = [
        { value: "blueprints / effects", label: "blueprints / effects" },
        { value: "1:1,000", label: "1:1,000" },
        { value: "1:7,500", label: "1:7,500" },
        { value: "1:8,000", label: "1:8,000" },
        { value: "1:12,000", label: "1:12,000" },
        { value: "Text", label: "Text" }
    ];

    //Document information
    const [title, setTitle] = useState("")
    const [stakeholders, setStakeholders] = useState(null)
    const [scale, setScale] = useState(null)
    const [issuanceDate, setIssuanceDate] = useState(new Date().toISOString().split('T')[0])
    const [docType, setDocType] = useState(null)
    const [numPages, setNumPages] = useState(0)
    const [connections, setConnections] = useState<Connection[]>([])
    const [language, setLanguage] = useState("")
    const [description, setDescription] = useState("")

    //Georeferencing information
    const [position, setPosition] = useState<LatLng | undefined>(positionProp)
    const [selectedCoordId, setSelectedCoordId] = useState<string | undefined>(selectedCoordIdProp)  //If the user selected an area, this variable contains the it of that area

    //Connection modal
    const [connectionModalOpen, setConnectionModalOpen] = useState(false)
    const connectionModalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '700px',
        },
        overlay: {zIndex: 1000}
    }

    const handleAddConnection = (connection: Connection) => {
        setConnectionModalOpen(false);
        setConnections([...connections, connection]);
        console.log(connections)
    }

    const handleDeleteConnection = (index: number) => {
        const newConnections = connections.filter((_, i) => i !== index);
        setConnections(newConnections);
    };   

    const handleEditConnection = (index : any, newConnection : Connection) => {
        const newConnections = connections.map((connection, i) => i === index ? newConnection : connection)
        setConnections(newConnections)
    };

    //Handle document position
    function MapClickHandler() {
        useMapEvents({
            click(e) {
                setSelectedCoordId(undefined);
                setPosition(e.latlng);
            }
        });
        return null;
    }

    return (
        <>
            <div className="w-full rounded shadow-md border">
                <h2 className="text-center text-2xl font-bold mt-6">Create a new document</h2>
                <form className="m-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-x-4 gap-y-3">
                        
                        {/* Grid one */}
                        <div className="col-span-1 row-span-1 col-start-1 row-start-1">

                            {/* Title */}
                            <div className="my-4">
                                <label className="mr-1 font-semibold">Title</label>
                                <span className="text-red-600">*</span>
                                <input className="focus:outline-none p-2 bg-white border block w-full rounded mt-2"
                                    type="text"
                                    value={title}
                                    onChange={({target}) => setTitle(target.value)}
                                />
                            </div>

                            {/* Stakeholders */}
                            <div className="my-4">
                                <label className="mr-1 font-semibold">Stakeholders</label>
                                <span className="text-red-600">*</span>
                                <Select
                                defaultValue={stakeholders}
                                onChange={setStakeholders}
                                options={stakeholdersOptions}
                                className="mt-2"
                                placeholder="Select stakeholders..."
                                />
                            </div>

                            {/* Scale of document */}
                            <div className="my-4">
                                <label className="mr-1 font-semibold">Scale</label>
                                <span className="text-red-600">*</span>
                                <Select
                                defaultValue={scale}
                                onChange={setScale}
                                options={scaleTypeOptions}
                                className="mt-2"
                                placeholder="Select scale..."
                                />
                            </div>

                            {/* Issuance date of document */}
                            <div className="mt-4">
                                <label className="mr-1 font-semibold">Issuance date</label>
                                <span className="text-red-600">*</span>
                                <input className="block p-2 border rounded w-full mt-2 focus:outline-none" 
                                    type="date" max={new Date().toISOString().split('T')[0]}
                                    value={issuanceDate} onChange={setIssuanceDate} />
                            </div> 
                        </div>

                        {/* Grid two */}
                        <div className="col-span-1 row-span-1 col-start-2 row-start-1">

                            {/* Description */}
                            <div className="my-4">
                                <label htmlFor="desc" className="mr-1 font-semibold">Description</label>
                                <span className="text-red-600">*</span>
                                <textarea id="desc" value={description} onChange={({target}) => setDescription(target.value)}
                                    className="block w-full border h-32 mt-2 p-2 resize-none rounded focus:outline-none" 
                                    maxLength="1000" />
                            </div>
            
                            {/* Language */}
                            <div className="my-4">
                                <label className="mr-1 font-semibold">Language</label>
                                <input className="focus:outline-none p-2 bg-white border block w-full rounded mt-2"
                                    type="text"
                                    value={language}
                                    onChange={({target}) => setLanguage(target.value)}
                                />
                            </div>

                            {/* Number of pages */}
                            <div className="mt-4">
                                <label htmlFor="number" className="mr-1 font-semibold">Page</label>
                                <input id="number" className="focus:outline-none p-2 bg-white border block w-full rounded mt-2"
                                    type="number"
                                    min="0"
                                    value={numPages}
                                    onChange={({target}) => setNumPages(parseInt(target.value))}
                                />
                            </div>
                        </div>

                        <div className="col-span-2 row-span-1 col-start-1 row-start-2 md:text-center mt-5">
                            {/* Type of document */}
                            <div className="">
                                <label className="mr-1 font-semibold">Type</label>
                                <span className="text-red-600">*</span>
                                <Select placeholder="Select document type..."
                                    defaultValue={docType}
                                    onChange={setDocType}
                                    options={documentTypeOptions}
                                    className="mt-2 max-w-[500px] md:mx-auto" />
                            </div>

                            <div className="my-2">
                                <label className="font-semibold">Connections</label>

                                {
                                    connections?.length === 0 ?
                                    <h1 className="mt-2 text-gray-500">No connections yet</h1> : connections?.length > 0 &&
                                    <ConnectionList connections={connections} handleDelete={handleDeleteConnection} handleEdit={handleEditConnection} handleAddConnection={handleAddConnection} />
                                }

                                <div onClick={() => setConnectionModalOpen(true)} className="flex items-center justify-center max-w-[100px] h-10 rounded md:mx-auto border border-dashed border-blue-500 group hover:bg-blue-500 cursor-pointer my-2">
                                    <FaPlus size={18} className="text-blue-500 group-hover:text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 row-span-1 col-start-1 row-start-3 mt-5">
                            <h4>Document position:</h4>
                            <div className='w-full grid md:text-center' style={{height: "70vh"}}>
                                <div className='w-80 absolute justify-self-end' style={{zIndex: 1000}}>
                                    <InputComponent 
                                        label="Select an area" 
                                        type="select" 
                                        options={Object.entries(coordinates).map(([areaId, info]: [string, any]) => {return {value: areaId, label: info["name"]} })} 
                                        value={selectedCoordId} 
                                        onChange={(v) => {
                                            setSelectedCoordId(v["target"]["value"]); 
                                            if(selectedCoordId && coordinates[selectedCoordId]["type"] == "Point") {
                                                setPosition(coordinates[selectedCoordId]["coordiates"]);
                                            }
                                            else {
                                                setPosition(undefined);
                                            }
                                        }
                                    } />
                                </div>

                                <MapContainer
                                    style={{ width: "100%", height: "100%", zIndex: 10 }}
                                    center={position ? position : kirunaLatLngCoords}   //The map is centered on the document's position, if exists. Otherwise it is centered on Kiruna
                                    zoom={13}
                                    doubleClickZoom={false}
                                    scrollWheelZoom={true}  // Enable the scroll wheel zoom
                                    zoomControl={false}   // Disable the zoom control, we will use a custom one
                                    touchZoom={true}    //Touch capabilities for smartphones. TODO: It needs to be tested

                                    maxBounds={[[67.800, 19.900], [67.900, 20.500]]}    // Limit the map dimension to Kiruna area
                                    maxBoundsViscosity={0.9}>
                                
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                                    {(position || (selectedCoordId && coordinates[selectedCoordId]["type"] == "Point")) && <Marker position={position || (selectedCoordId && coordinates[selectedCoordId]["coordinates"])} /> }
                                    {selectedCoordId && coordinates[selectedCoordId]["type"] == "Polygon" &&
                                        <Polygon pathOptions={{color: "blue"}} positions={coordinates[selectedCoordId]["coordinates"]}>
                                            
                                        </Polygon>
                                    }

                                    <MapClickHandler />
                                    
                                    <ZoomControl position="bottomleft" />
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <Modal style={connectionModalStyles} isOpen={connectionModalOpen} onRequestClose={() => setConnectionModalOpen(false)}>
                <div className="relative">
                    <button onClick={() => setConnectionModalOpen(false)} className="absolute top-0 right-0 p-2 text-xl text-gray-500 hover:text-gray-700">
                        &times;
                    </button>

                    <ConnectionForm setModalOpen={setConnectionModalOpen} handleAddConnection={handleAddConnection} />
                </div>
            </Modal>
        </>
    );
};

export default DocumentForm;
