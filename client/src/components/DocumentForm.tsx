import { useState } from 'react';
import Select from 'react-select';
import ConnectionList from './ConnectionList';
import ConnectionForm from './ConnectionForm';
import { FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import { kirunaLatLngCoords, modalStyles } from './Map';
import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  Tooltip,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet';
import { LatLng } from 'leaflet';
import InputComponent from './atoms/input/input';
import { ButtonRounded } from './Button';
import Toast from './Toast';

import API from '../API';

Modal.setAppElement('#root');

export interface Connection {
  type: string;
  relatedDocument: string;
}

interface DocumentFormProps {
  positionProp?: LatLng;
  selectedCoordIdProp?: string;
  coordinates: any;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

const DocumentForm = ({
  positionProp,
  selectedCoordIdProp,
  coordinates
}: DocumentFormProps) => {

  const stakeholdersOptions = [
    { value: 'Kiruna Kommun', label: 'Kiruna Kommun' },
    { value: 'Kiruna Kommun / Residents', label: 'Kiruna Kommun / Residents' },
    {
      value: 'Kiruna Kommun / White Arkitekter',
      label: 'Kiruna Kommun / White Arkitekter',
    },
    { value: 'LKAB', label: 'LKAB' },
  ];

  const documentTypeOptions = [
    { value: 'Agreement', label: 'Agreement' },
    { value: 'Conflict', label: 'Conflict' },
    { value: 'Consultation', label: 'Consultation' },
    { value: 'Material effects', label: 'Material effects' },
    { value: 'Prescriptive document', label: 'Prescriptive document' },
    { value: 'Design document', label: 'Design document' },
    { value: 'Informative document', label: 'Informative document' },
    { value: 'Technical document', label: 'Technical document' },
  ];

  const scaleTypeOptions = [
    { value: 'blueprints / effects', label: 'blueprints / effects' },
    { value: '1:1,000', label: '1:1,000' },
    { value: '1:7,500', label: '1:7,500' },
    { value: '1:8,000', label: '1:8,000' },
    { value: '1:12,000', label: '1:12,000' },
    { value: 'Text', label: 'Text' },
  ];

  // Document information
  const [title, setTitle] = useState('');
  const [stakeholders, setStakeholders] = useState({value: "", label: ""});
  const [scale, setScale] = useState({value: "", label: ""});
  const [issuanceDate, setIssuanceDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [docType, setDocType] = useState({value: "", label: ""});
  const [numPages, setNumPages] = useState(0);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [language, setLanguage] = useState('');
  const [description, setDescription] = useState('');

  // Georeferencing information
  const [position, setPosition] = useState<LatLng | undefined>(positionProp);
  const [selectedCoordId, setSelectedCoordId] = useState<string | undefined>(
    selectedCoordIdProp,
  ); //If the user selected an area, this variable contains the it of that area

  // Connection modal : To enter a new connection
  const [connectionModalOpen, setConnectionModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [connectionToEdit, setConnectionToEdit] = useState<Connection | null>(null);
  const [toastMsg, setToastMsg] = useState({
    isShown: false,
    type: "success",
    message: "",
  });

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
    setConnectionModalOpen(true);
  };

  const openAddForm = () => {
    setConnectionToEdit(null);
    setEditIndex(null);
    setMode('add');
    setConnectionModalOpen(true);
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

    const document = {
      title,
      stakeholders: stakeholders.value,
      scale: scale.value,
      type: docType.value,
      date: issuanceDate,
      connections,
      language,
      numPages,
      summary: description
    };

    API.addDocument(document)
      .then((response) => {
        if (response && response.data) {
          showToastMessage(response.data.message, "success");
        }
      })
      .catch((error : any) => {
        showToastMessage(error.message, "error");
      });
  }

  // Handle document position
  function MapClickHandler() {
    useMapEvents({
      dblclick(e) {
        setSelectedCoordId(undefined);
        setPosition(e.latlng);
        // setCoordNamePopupOpen(true);
      },
    });
    return null;
  }

  // console.log(showCoordNamePopup);

  return (
    <>
      <div className="w-full rounded shadow-md border">
        <h2 className="text-center text-2xl font-bold mt-6">Create a new document</h2>
        <form onSubmit={handleSubmit} className="m-6">
          <div>

            <div>

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

            <div>

              {/* Description */}
              <div className="my-2 col-span-2">
                <label htmlFor="desc" className="mr-1 font-semibold">
                  Description
                </label>
                <span className="text-red-600">*</span>
                <textarea
                  id="desc"
                  value={description}
                  onChange={({ target }) => setDescription(target.value)}
                  className="block w-full border h-32 mt-1 p-2 resize-none rounded focus:outline-none"
                  maxLength="1000"
                />
              </div>

              {/* Language */}
              <div className="my-2">
                <label className="mr-1 font-semibold">Language</label>
                <input
                  className="focus:outline-none p-2 bg-white border block w-full rounded mt-1"
                  type="text"
                  value={language}
                  onChange={({ target }) => setLanguage(target.value)}
                />
              </div>

              {/* Number of pages */}
              <div className="my-2">
                <label htmlFor="number" className="mr-1 font-semibold">
                  Page
                </label>
                <input
                  id="number"
                  className="focus:outline-none p-2 bg-white border block w-full rounded mt-1"
                  type="number"
                  min="0"
                  value={numPages}
                  onChange={({ target }) => setNumPages(parseInt(target.value))}
                />
              </div>
            </div>

            <div>

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
                  <h1 className="mt-2 text-gray-500 text-sm">No connections yet</h1> : connections?.length > 0 &&
                  <ConnectionList 
                  connections={connections} 
                  handleDelete={handleDeleteConnection} 
                  openEditForm={openEditForm} />
                }

                <div onClick={() => openAddForm()} className="flex items-center justify-center max-w-[100px] h-10 rounded  border border-dashed border-blue-500 group hover:bg-blue-500 cursor-pointer my-2">
                    <FaPlus size={18} className="text-blue-500 group-hover:text-white" />
                </div>
              </div>
            </div>

            {/* Document position */}
            <div className="col-span-2">
              <h4>Document position:</h4>
              <div
                className="w-full grid md:text-center"
                style={{ height: '70vh' }}
              >
                <div
                  className="w-80 absolute justify-self-end"
                  style={{ zIndex: 1000 }}
                >
                  <InputComponent
                    label="Select an area"
                    type="select"
                    options={Object.entries(coordinates).map(
                      ([areaId, info]: [string, any]) => {
                        return { value: areaId, label: info['name'] };
                      },
                    )}
                    value={selectedCoordId}
                    onChange={(v) => {
                      setSelectedCoordId(v['target']['value']);
                      if (
                        selectedCoordId &&
                        coordinates[selectedCoordId]['type'] == 'Point'
                      ) {
                        setPosition(coordinates[selectedCoordId]['coordiates']);
                      } else {
                        setPosition(undefined);
                      }
                    }}
                  />
                </div>

                <MapContainer
                  style={{ width: '100%', height: '100%', zIndex: 10 }}
                  center={position ? position : kirunaLatLngCoords} //The map is centered on the document's position, if exists. Otherwise it is centered on Kiruna
                  zoom={13}
                  doubleClickZoom={false}
                  scrollWheelZoom={true} // Enable the scroll wheel zoom
                  zoomControl={false} // Disable the zoom control, we will use a custom one
                  touchZoom={true} //Touch capabilities for smartphones. TODO: It needs to be tested
                  maxBounds={[
                    [67.8, 19.9],
                    [67.9, 20.5],
                  ]} // Limit the map dimension to Kiruna area
                  maxBoundsViscosity={0.9}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {(position ||
                    (selectedCoordId &&
                      coordinates[selectedCoordId]['type'] == 'Point')) && (
                      <Marker position={position || (selectedCoordId && coordinates[selectedCoordId]["coordinates"])} ref={(r) => {
                        r?.openPopup();
                      }}>
                        <Tooltip permanent> {
                            selectedCoordId ? (
                              coordinates[selectedCoordId]["name"]
                            ) : (
                              coordName
                            )
                          }
                        </Tooltip>
                      </Marker>
                  )}

                  {
                    coordNamePopupOpen && position &&
                    <Popup position={position} closeButton={false} closeOnClick={false} closeOnEscapeKey={false} autoClose={false}>
                      <>
                        <InputComponent label="Enter the name of the new point/area" type="text" placeholder='Enter the name of the new point/area...' required={true} value={coordName} onChange={(v) => setCoordName(v["target"]["value"])} />
                        <div className='flex justify-between'>
                            <ButtonRounded variant="filled" text="Confirm" className="bg-black text-white text-xs pt-2 pb-2 pl-3 pr-3" onClick={() => {
                                if(coordName.trim() != "") {
                                  setCoordNamePopupOpen(false);
                                }
                              }} 
                            />
                            <ButtonRounded variant="outlined" text="Cancel" className="text-xs pt-2 pb-2 pl-3 pr-3" onClick={() => {setPosition(undefined); setCoordName(""); setCoordNamePopupOpen(false)}}/>
                        </div>
                      </>
                    </Popup>
                  }

                  {selectedCoordId &&
                    coordinates[selectedCoordId]['type'] == 'Polygon' && (
                      <Polygon
                        pathOptions={{ color: 'blue' }}
                        positions={coordinates[selectedCoordId]['coordinates']}
                      ></Polygon>
                    )}

                  <MapClickHandler />

                  <ZoomControl position="bottomleft" />
                </MapContainer>
              </div>
            </div>

            {/* Save and Cancel buttons */}
            <div className="col-span-2 flex justify-end mt-4">
              <ButtonRounded
                variant="outlined"
                text="Cancel"
                className="text-base pt-2 pb-2 pl-4 pr-4 mr-2"
                onClick={() => {
                  closeModal();
                }}
              />
              <ButtonRounded
                variant="filled"
                text="Save"
                className="bg-black text-white text-base pt-2 pb-2 pl-4 pr-4"
                type="submit"
              />
            </div>
          </div>
        </form>
      </div>

      <Modal style={modalStyles} isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
        <div className="relative">
          <button onClick={() => setConnectionModalOpen(false)} className="absolute top-0 right-0 p-2 text-xl text-gray-500 hover:text-gray-700">
            &times;
          </button>

          <ConnectionForm closeModal={() => setConnectionModalOpen(false)} 
            handleAdd={handleAddConnection }
            handleEdit={handleEditConnection} 
            mode={mode}
            connectionToEdit={connectionToEdit}
            editIndex={editIndex} />
        </div>
      </Modal>

      <Toast
        isShown={toastMsg.isShown}
        message={toastMsg.message}
        type={toastMsg.type}
        onClose={hideToastMessage}/>
    </>
  );
};

export default DocumentForm;
