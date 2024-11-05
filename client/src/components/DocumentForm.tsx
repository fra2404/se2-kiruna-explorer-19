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
import Toast from './Toast';

Modal.setAppElement("#root");

export interface Connection {
  type: string;
  relatedDocument: string;
}

const DocumentForm = (props: any) => {
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

    const [title, setTitle] = useState(props.selectedDocument ? props.selectedDocument["title"] || "" : "")
    const [stakeholders, setStakeholders] = useState(props.selectedDocument ? props.selectedDocument["stakeholders"] || null : null)
    const [scale, setScale] = useState(props.selectedDocument ? props.selectedDocument["scale"] || null : null)
    const [issuanceDate, setIssuanceDate] = useState(props.selectedDocument ? ( props.selectedDocument["issuanceDate"] ? props.selectedDocument["issuanceDate"] : new Date().toISOString().split('T')[0] ) : new Date().toISOString().split('T')[0])
    const [docType, setDocType] = useState(props.selectedDocument ? props.selectedDocument["type"] || null : null)
    const [numPages, setNumPages] = useState(props.selectedDocument ? props.selectedDocument["numPages"] || 0 : 0)
    const [connections, setConnections] = useState<Connection[]>(props.selectedDocument ? props.selectedDocument["connections"] || [] : [])
    const [language, setLanguage] = useState(props.selectedDocument ? props.selectedDocument["language"] || "" : "")
    const [description, setDescription] = useState(props.selectedDocument ? props.selectedDocument["description"] || "" : "")
    const [position, setPosition] = useState(props.position)
    const [selection, setSelection] = useState(props.selection)                 //Can be "position" or "area", according to what the user selected
    const [selectedAreaId, setSelectedAreaId] = useState(props.selectedAreaId)  //If the user selected an area, this variable contains the it of that area
    const [toastMsg, setToastMsg] = useState({
        isShown: false,
        type: "success",
        message: "",
    });

    // Connection modal
    const [modalOpen, setModalOpen] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [mode, setMode] = useState<'add' | 'edit'>('add');
    const [connectionToEdit, setConnectionToEdit] = useState<Connection | null>(null);

    const modalStyles = {
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
        overlay: { zIndex: '1000' },
    }

    const handleAddConnection = (connection: Connection) => {
        setConnections([...connections, connection]);
    } 

    const handleDeleteConnection = (index: number) => {
        const updatedConnections = connections.filter((_, i) => i !== index);
        setConnections(updatedConnections);
    };  
    
    const handleEditConnection = (index : number, updatedConnection: Connection) => {
        const updatedConnections = connections.map((conn, i) =>
            i === index ? updatedConnection : conn
        );
        setConnections(updatedConnections);
    }

    const openEditForm = (index: number) => {
        setConnectionToEdit(connections[index]);
        setEditIndex(index);
        setMode('edit');
        setModalOpen(true);
    };

    const openAddForm = () => {
        setConnectionToEdit(null);
        setEditIndex(null);
        setMode('add');
        setModalOpen(true);
    };

    const showToastMessage = (message: string, type: string) => {
        setToastMsg({
          isShown: true,
          message,
          type,
        });
    };

    const hideToastMessage = () => {
        setToastMsg({
          isShown: false,
          message: "",
          type: "error",
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();


        if (!title || !docType || !stakeholders || !scale || !issuanceDate || !description) {
            showToastMessage("Please fill all required fields", "error");
            return;
        }

        if ((latitude && !validateLatitude(latitude)) || (longitude && !validateLongitude(longitude))) {
            showToastMessage("Invalid latitude or longitude", "error");
            return;
        }


        // submit the form
    }

    //Handle document position
    function MapClickHandler() {
        useMapEvents({
            click(e) {
                setSelection("position");
                setSelectedAreaId(undefined);
                setPosition(e.latlng);
            }
        });
        return null;
    }

    return (
        <>
            <div className="w-full rounded shadow-md border">
                <h2 className="text-center text-2xl font-bold mt-6">Create a new document</h2>
                <form onSubmit={handleSubmit} className="m-6">
                    <div className="">
                        
                        <div className="">

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

                            {/* Type of document */}
                            <div className="">
                                <label className="mr-1 font-semibold">Type</label>
                                <span className="text-red-600">*</span>
                                <Select placeholder="Select document type..."
                                    defaultValue={docType}
                                    onChange={setDocType}
                                    options={documentTypeOptions}
                                    className="mt-2 w-full" />
                            </div>

                            {/* Stakeholders */}
                            <div className="my-4">
                                <label className="mr-1 font-semibold">Stakeholders</label>
                                <span className="text-red-600">*</span>
                                <Select
                                defaultValue={stakeholders}
                                onChange={setStakeholders}
                                options={stakeholdersOptions}
                                className="mt-2 w-full"
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
                                className="mt-2 w-full"
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

                        <div className="">

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

                        <div className="mt-3">
                            <div className="my-2">
                                <label className="font-semibold">Connections</label>

                                {
                                    connections?.length === 0 ?
                                    <h1 className="mt-2 text-gray-500 text-sm">No connections yet</h1> : connections?.length > 0 &&
                                    <ConnectionList connections={connections} handleDelete={handleDeleteConnection} openEditForm={openEditForm} />
                                }

                                <div onClick={() => openAddForm()} className="flex items-center justify-center max-w-[100px] h-10 rounded  border border-dashed border-blue-500 group hover:bg-blue-500 cursor-pointer my-2">
                                    <FaPlus size={18} className="text-blue-500 group-hover:text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 row-span-1 col-start-1 row-start-3 mt-5">
                            <h4>Document position:</h4>
                            <div className='w-full grid md:text-center' style={{height: "70vh"}}>
                                <div className='w-80 absolute pr-4 justify-self-end' style={{zIndex: 1000}}>
                                    <InputComponent label="Select an area" type="select" options={Object.entries(props.areas).map(([areaId, info]: [string, any]) => {return {value: areaId, label: info["name"]} })} value={selectedAreaId} onChange={(v) => {setSelectedAreaId(v["target"]["value"]); setSelection("area"); setPosition(undefined) }} />
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
                                    {selection == "position" && position && <Marker position={position} /> }
                                    {selection == "area" && selectedAreaId && 
                                        <Polygon pathOptions={{color: "blue"}} positions={props.areas[selectedAreaId]["coords"] as LatLng[]}>
                                            
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

            <Modal style={modalStyles} isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
                <div className="relative">
                    <button onClick={() => setModalOpen(false)} className="absolute top-0 right-0 p-2 text-xl text-gray-500 hover:text-gray-700">
                        &times;
                    </button>

                    <ConnectionForm closeModal={() => setModalOpen(false)} 
                    handleAdd={handleAddConnection }
                    handleEdit={handleEditConnection} 
                    mode={mode}
                    connectionToEdit={connectionToEdit}
                    editIndex={editIndex} />
                </div>
            </Modal>
        </>
    );
};

export default DocumentForm;
