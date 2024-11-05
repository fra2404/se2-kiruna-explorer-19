import { useState } from 'react';
import Select from 'react-select';
import ConnectionList from './ConnectionList';
import ConnectionForm from './ConnectionForm';
import { FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import { kirunaLatLngCoords } from './Map';
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  Tooltip,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet';
import { LatLng } from 'leaflet';
import InputComponent from './atoms/input/input';
import { ButtonRounded } from './Button';

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
  coordinates,
  modalOpen,
  setModalOpen,
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

  //Document information
  const [title, setTitle] = useState('');
  const [stakeholders, setStakeholders] = useState(null);
  const [scale, setScale] = useState(null);
  const [issuanceDate, setIssuanceDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [docType, setDocType] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [language, setLanguage] = useState('');
  const [description, setDescription] = useState('');

  //Georeferencing information
  const [position, setPosition] = useState<LatLng | undefined>(positionProp);
  const [selectedCoordId, setSelectedCoordId] = useState<string | undefined>(
    selectedCoordIdProp,
  ); //If the user selected an area, this variable contains the id of that area
  const [coordName, setCoordName] = useState("")

  //Connection modal
  const [connectionModalOpen, setConnectionModalOpen] = useState(false);
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
    overlay: { zIndex: 1000 },
  };

  //coordNameModal
    const [coordNameModalOpen, setCoordNameModalOpen] = useState((!selectedCoordId && position) ? true : false)
    const coordNameModalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '500px',
        },
        overlay: {zIndex: 1000}
    }

  const handleAddConnection = (connection: Connection) => {
    setConnectionModalOpen(false);
    setConnections([...connections, connection]);
    console.log(connections);
  };

  const handleDeleteConnection = (index: number) => {
    const newConnections = connections.filter((_, i) => i !== index);
    setConnections(newConnections);
  };

  const handleEditConnection = (index: any, newConnection: Connection) => {
    const newConnections = connections.map((connection, i) =>
      i === index ? newConnection : connection,
    );
    setConnections(newConnections);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  //Handle document position
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setSelectedCoordId(undefined);
        setPosition(e.latlng);
        setCoordNameModalOpen(true);
      },
    });
    return null;
  }

  return (
    <>
      <div className="w-full rounded shadow-md border">
        <h2 className="text-center text-2xl font-bold mt-6">
          Create a new document
        </h2>
        <form className="m-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            {/* Title */}
            <div className="my-2">
              <label className="mr-1 font-semibold">Title</label>
              <span className="text-red-600">*</span>
              <input
                className="focus:outline-none p-2 bg-white border block w-full rounded mt-1"
                type="text"
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
            </div>

            {/* Stakeholders */}
            <div className="my-2">
              <label className="mr-1 font-semibold">Stakeholders</label>
              <span className="text-red-600">*</span>
              <Select
                defaultValue={stakeholders}
                onChange={setStakeholders}
                options={stakeholdersOptions}
                className="mt-1"
                placeholder="Select stakeholders..."
              />
            </div>

            {/* Scale of document */}
            <div className="my-2">
              <label className="mr-1 font-semibold">Scale</label>
              <span className="text-red-600">*</span>
              <Select
                defaultValue={scale}
                onChange={setScale}
                options={scaleTypeOptions}
                className="mt-1"
                placeholder="Select scale..."
              />
            </div>

            {/* Issuance date of document */}
            <div className="my-2">
              <label className="mr-1 font-semibold">Issuance date</label>
              <span className="text-red-600">*</span>
              <input
                className="block p-2 border rounded w-full mt-1 focus:outline-none"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={issuanceDate}
                onChange={({ target }) => setIssuanceDate(target.value)}
              />
            </div>

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

            {/* Type of document */}
            <div className="my-2 col-span-2">
              <label className="mr-1 font-semibold">Type</label>
              <span className="text-red-600">*</span>
              <Select
                placeholder="Select document type..."
                defaultValue={docType}
                onChange={setDocType}
                options={documentTypeOptions}
                className="mt-1"
              />
            </div>

            {/* Connections */}
            <div className="my-2 col-span-2">
              <label className="font-semibold">Connections</label>

              {connections?.length === 0 ? (
                <h1 className="mt-1 text-gray-500">No connections yet</h1>
              ) : (
                connections?.length > 0 && (
                  <ConnectionList
                    connections={connections}
                    handleDelete={handleDeleteConnection}
                    handleEdit={handleEditConnection}
                    handleAddConnection={handleAddConnection}
                  />
                )
              )}

              <div
                onClick={() => setConnectionModalOpen(true)}
                className="flex items-center justify-center max-w-[100px] h-10 rounded md:mx-auto border border-dashed border-blue-500 group hover:bg-blue-500 cursor-pointer my-2"
              >
                <FaPlus
                  size={18}
                  className="text-blue-500 group-hover:text-white"
                />
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
                      <Marker position={position || (selectedCoordId && coordinates[selectedCoordId]["coordinates"])}>
                        <Tooltip permanent direction="top" offset={[-15, -10]}>{selectedCoordId ? coordinates[selectedCoordId]["name"] : coordName}</Tooltip>
                      </Marker>
                  )}
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

      <Modal
        style={connectionModalStyles}
        isOpen={connectionModalOpen}
        onRequestClose={() => setConnectionModalOpen(false)}
      >
        <div className="relative">
          <button
            onClick={() => setConnectionModalOpen(false)}
            className="absolute top-0 right-0 p-2 text-xl text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>

          <ConnectionForm
            setModalOpen={setConnectionModalOpen}
            handleAddConnection={handleAddConnection}
          />
        </div>
      </Modal>

      <Modal style={coordNameModalStyles} isOpen={coordNameModalOpen} onRequestClose={() => {setCoordNameModalOpen(false); setPosition(undefined); setCoordName("")} }>
        <InputComponent label="Enter the name of the new point/area" type="text" placeholder='Enter the name of the new point/area...' required={true} value={coordName} onChange={(v) => setCoordName(v["target"]["value"])} />
        <div className='flex justify-between'>
            <ButtonRounded variant="filled" text="Confirm" className="bg-black text-white text-base pt-2 pb-2 pl-3 pr-3" onClick={() => {
                if(coordName.trim() != "") {
                  setCoordNameModalOpen(false);
                }
              }} 
            />
            <ButtonRounded variant="outlined" text="Cancel" className="text-base pt-2 pb-2 pl-3 pr-3" onClick={() => {setPosition(undefined); setCoordName(""); setCoordNameModalOpen(false)}}/>
        </div>
      </Modal>
    </>
  );
};

export default DocumentForm;
