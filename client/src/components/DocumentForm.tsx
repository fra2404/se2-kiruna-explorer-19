import { useState } from 'react';
import ConnectionList from './ConnectionList';
import ConnectionForm from './ConnectionForm';
import Modal from 'react-modal';
import { kirunaLatLngCoords } from './Map';
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
import AgreementIcon from '../assets/icons/agreement-icon';
import ConflictIcon from '../assets/icons/conflict-icon';
import ConsultationIcon from '../assets/icons/consultation-icon';
import DesignDocIcon from '../assets/icons/design-doc-icon';
import InformativeDocIcon from '../assets/icons/informative-doc-icon';
import MaterialEffectsIcon from '../assets/icons/material-effects-icon';
import PrescriptiveDocIcon from '../assets/icons/prescriptive-doc-icon';
import TechnicalDocIcon from '../assets/icons/technical-doc-icon';
import { createDocument } from '../API';
import { FaCheckCircle } from 'react-icons/fa'; // Imports success icon from react-icons
import Toast from './Toast';

Modal.setAppElement('#root');

export interface Connection {
  type: string;
  relatedDocument: any;
}

interface DocumentFormProps {
  positionProp?: LatLng;
  selectedCoordIdProp?: string;
  coordinates: any;
  showCoordNamePopup?: boolean;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

const DocumentForm = ({
  positionProp,
  selectedCoordIdProp,
  coordinates,
  showCoordNamePopup = false,
}: DocumentFormProps) => {
  console.log('DocumentForm props:', {
    positionProp,
    selectedCoordIdProp,
    coordinates,
    showCoordNamePopup,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [connectToMap, setConnectToMap] = useState(
    !!positionProp || !!selectedCoordIdProp,
  );

  const documentTypeOptions = [
    {
      value: 'AGREEMENT',
      label: 'Agreement',
      icon: <AgreementIcon fillColor="#000" />,
    },
    {
      value: 'CONFLICT',
      label: 'Conflict',
      icon: <ConflictIcon fillColor="#000" />,
    },
    {
      value: 'CONSULTATION',
      label: 'Consultation',
      icon: <ConsultationIcon fillColor="#000" />,
    },
    {
      value: 'DESIGN_DOC',
      label: 'Design document',
      icon: <DesignDocIcon fillColor="#000" />,
    },
    {
      value: 'INFORMATIVE_DOC',
      label: 'Informative document',
      icon: <InformativeDocIcon fillColor="#000" />,
    },
    {
      value: 'MATERIAL_EFFECTS',
      label: 'Material effects',
      icon: <MaterialEffectsIcon fillColor="#000" />,
    },
    {
      value: 'PRESCRIPTIVE_DOC',
      label: 'Prescriptive document',
      icon: <PrescriptiveDocIcon fillColor="#000" />,
    },
    {
      value: 'TECHNICAL_DOC',
      label: 'Technical document',
      icon: <TechnicalDocIcon fillColor="#000" />,
    },
  ];

  // Document information
  const [title, setTitle] = useState('');
  const [stakeholders, setStakeholders] = useState<string | undefined>(
    undefined,
  );
  const [scale, setScale] = useState<string | undefined>('');
  const [issuanceDate, setIssuanceDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [docType, setDocType] = useState<string | undefined>(undefined);
  //const [numPages, setNumPages] = useState(0);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [language, setLanguage] = useState('');
  const [description, setDescription] = useState('');

  // Georeferencing information
  const [position, setPosition] = useState<LatLng | undefined>(positionProp);
  const [selectedCoordId, setSelectedCoordId] = useState<string | undefined>(
    selectedCoordIdProp,
  ); //If the user selected an area, this variable contains the id of that area
  const [coordName, setCoordName] = useState('');
  const [coordNamePopupOpen, setCoordNamePopupOpen] =
    useState(showCoordNamePopup);

  const [isDocumentSaved, setIsDocumentSaved] = useState(false);

  // Connection modal : To enter a new connection
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

  const handleAddConnection = (connection: Connection) => {
    setConnections([...connections, connection]);
    console.log('sono qui', connections);
  };

  const handleDeleteConnection = (index: number) => {
    const updatedConnections = connections.filter((_, i) => i !== index);
    setConnections(updatedConnections);
  };
    
  /*const handleEditConnection = (index : number, updatedConnection: Connection) => {
    const updatedConnections = connections.map((conn, i) =>
    i === index ? updatedConnection : conn
  );
    setConnections(updatedConnections);
  }*/

  //Toast
  const [toastMsg, setToastMsg] = useState<{isShown: boolean, type: "success" | "error", message: string}>({
    isShown: false,
    type: "success",
    message: "",
  });

  const showToastMessage = (message: string, type: "success" | "error") => {
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

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return (
          title.trim() !== '' &&
          stakeholders !== '' &&
          scale !== '' &&
          issuanceDate.trim() !== ''
        );
      case 2:
        return (docType ?? '').trim() !== '';
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const documentData = {
      title,
      stakeholders: stakeholders || '',
      scale: scale || '',
      type: docType || '',
      language,
      summary: description,
      date: issuanceDate,
      coordinates: selectedCoordId || '',
      connections: connections.map((conn) => ({
        document: conn.relatedDocument.value,
        type: conn.type,
      })),
    };
    console.log('Document Data:', documentData);

    try {
      const response = await createDocument(documentData);
      if (response.success) {
        console.log('Document created successfully:', response.document);
        showToastMessage("Document created successfully", "success");
        // Puoi aggiungere ulteriori azioni qui, come la navigazione a un'altra pagina o la visualizzazione di un messaggio di successo
        setIsDocumentSaved(true);
        setCurrentStep(5);
      } else {
        console.log('Failed to create document');
        showToastMessage("Failed to create document", "error");
        // Puoi aggiungere ulteriori azioni qui, come la visualizzazione di un messaggio di errore
      }
    } catch (error) {
      console.error('Error creating document:', error);
      showToastMessage("Error creating document:" + error, "error");
      // Puoi aggiungere ulteriori azioni qui, come la visualizzazione di un messaggio di errore
    }
  };

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


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            {/* Title */}
            <div className="my-2">
              <InputComponent
                label="Title"
                type="text"
                value={title}
                onChange={(v) => {
                  if ('target' in v) {
                    setTitle(v.target.value);
                  }
                }}
                required={true}
                placeholder="Enter title"
              />
            </div>

            {/* Stakeholders */}
            <div className="my-2">
              <InputComponent
                label="Stakeholder"
                type="text"
                value={stakeholders}
                onChange={(v) => {
                  if ('target' in v) {
                    setStakeholders(v.target.value);
                  }
                }}
                required={true}
                placeholder="Enter stakeholder"
              />
            </div>

            {/* Scale of document */}
            <div className="my-2">
              <InputComponent
                label="Scale"
                type="text"
                value={scale}
                onChange={(v) => {
                  if ('target' in v) {
                    setScale(v.target.value);
                  }
                }}
                required={true}
                placeholder="Enter scale"
              />
            </div>

            {/* Issuance date of document */}
            <div className="my-2">
              <InputComponent
                label="Issuance date"
                type="date"
                value={issuanceDate}
                onChange={(e) => {
                  if ('target' in e) {
                    setIssuanceDate(e.target.value);
                  }
                }}
                required={true}
                placeholder="Select issuance date"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            {/* Description */}
            <div className="my-2 col-span-2">
              <InputComponent
                label="Description"
                type="textarea"
                value={description}
                onChange={(e) => {
                  if ('target' in e) {
                    setDescription(e.target.value);
                  }
                }}
                required={false}
                placeholder="Enter description"
                maxLength={1000} // Assicurati che il tuo InputComponent supporti questa proprietà
              />
            </div>

            {/* Language */}
            <div className="my-2">
              <InputComponent
                label="Language"
                type="text"
                value={language}
                onChange={(e) => {
                  if ('target' in e) {
                    setLanguage(e.target.value);
                  }
                }}
                placeholder="Enter language"
              />
            </div>

            {/* Number of pages */}
            {/* <div className="my-2">
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
            </div> */}

            {/* Type of document */}
            <div className="my-2 col-span-2">
              <InputComponent
                label="Type"
                type="select"
                options={documentTypeOptions}
                value={docType}
                onChange={(e) => {
                  if ('target' in e) {
                    setDocType(e.target.value);
                  }
                }}
                required={true}
                placeholder="Select document type..."
              />
            </div>
          </>
        );
      case 3:
        return (
          <>
            {/* Connections */}
            <div className="my-2 col-span-2">
              <label className="font-semibold">Connections</label>

              {connections?.length === 0 ? (
                <p className="mt-1 text-gray-500">No connections yet</p>
              ) : (
                connections?.length > 0 && (
                  <ConnectionList
                    connections={connections}
                    handleDelete={handleDeleteConnection}
                  />
                )
              )}

              <div className="flex items-center justify-center max-w-[100px] md:mx-auto my-2">
                <ButtonRounded
                  variant="filled"
                  text="Add Connection"
                  className="bg-black text-white text-xs pt-2 pb-2 pl-3 pr-3"
                  onClick={() => setConnectionModalOpen(true)}
                />
              </div>
            </div>

            {/* Connect to map */}
            <div className="my-2 col-span-2">
              <InputComponent
                label="Connect this document to a point on the map"
                type="checkbox"
                checked={connectToMap}
                onChange={() => setConnectToMap(!connectToMap)}
              />
            </div>
          </>
        );
      case 4:
        return (
          <>
            {/* Document position */}
            <div className="col-span-2">
              <h4>Document position:</h4>
              <div
                className="w-full grid md:text-center"
                style={{ height: '50vh' }}
              >
                <div className="w-80 justify-self-end h-auto" style={{ zIndex: 1000 }}>
                  <InputComponent
                    label="Select an area or point that already exists"
                    type="select"
                    options={Object.entries(coordinates).map(
                      ([areaId, info]: [string, any]) => {
                        return { value: areaId, label: info['name'] };
                      },
                    )}
                    defaultValue={selectedCoordIdProp}
                    value={selectedCoordId}
                    onChange={(v: React.ChangeEvent<HTMLSelectElement>) => {
                      setSelectedCoordId(v.target.value);
                      if (
                        selectedCoordId &&
                        coordinates[selectedCoordId]['type'] == 'Point'
                      ) {
                        setPosition(
                          coordinates[selectedCoordId]['coordinates'],
                        );
                      } else {
                        setPosition(undefined);
                      }
                    }}
                  />
                </div>

                <MapContainer
                  style={{ width: '100%', height: '100%', zIndex: 10 }}
                  center={position ? position : kirunaLatLngCoords} //The map is centered on the document's position, if exists. Otherwise it is centered on Kiruna
                  zoom={15}
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
                    <Marker
                      position={
                        position ||
                        (selectedCoordId &&
                          coordinates[selectedCoordId]['coordinates'])
                      }
                      ref={(r) => {
                        r?.openPopup();
                      }}
                    >
                      <Tooltip permanent>
                        {' '}
                        {selectedCoordId
                          ? coordinates[selectedCoordId]['name']
                          : coordName}
                      </Tooltip>
                    </Marker>
                  )}

                  {coordNamePopupOpen && position && (
                    <Popup
                      position={position}
                      closeButton={false}
                      closeOnClick={false}
                      closeOnEscapeKey={false}
                      autoClose={false}
                    >
                      <>
                        <InputComponent
                          label="Enter the name of the new point/area"
                          type="text"
                          placeholder="Enter the name of the new point/area..."
                          required={true}
                          value={coordName}
                          onChange={(v) => {
                            if ('target' in v) {
                              setCoordName(v.target.value);
                            }
                          }}
                        />
                        <div className="flex justify-between">
                          <ButtonRounded
                            variant="filled"
                            text="Confirm"
                            className="bg-black text-white text-xs pt-2 pb-2 pl-3 pr-3"
                            onClick={() => {
                              if (coordName.trim() != '') {
                                setCoordNamePopupOpen(false);
                              }
                            }}
                          />
                          <ButtonRounded
                            variant="outlined"
                            text="Cancel"
                            className="text-xs pt-2 pb-2 pl-3 pr-3"
                            onClick={() => {
                              setPosition(undefined);
                              setCoordName('');
                              setCoordNamePopupOpen(false);
                            }}
                          />
                        </div>
                      </>
                    </Popup>
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
          </>
        );
      case 5:
        return (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <FaCheckCircle className="w-24 h-24 text-green-500" />
            <h2 className="text-2xl font-bold mt-4">Document Saved</h2>
            <p className="text-sm text-gray-500">PLS, centered this</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full rounded shadow-md border">
        <h2 className="text-center text-2xl font-bold mt-6">
          Create a new document
        </h2>
        <form className="m-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            {renderStep()}

            {/* Navigation buttons */}
            <div className="col-span-2 flex justify-between mt-4">
              {currentStep > 1 && currentStep < 5 && (
                <ButtonRounded
                  variant="outlined"
                  text="Previous"
                  className="text-base pt-2 pb-2 pl-4 pr-4"
                  onClick={() => setCurrentStep(currentStep - 1)}
                />
              )}
              {currentStep < (connectToMap ? 4 : 3) && (
                <ButtonRounded
                  variant="filled"
                  text="Next"
                  className="bg-black text-white text-base pt-2 pb-2 pl-4 pr-4"
                  onClick={handleNextStep}
                />
              )}
              {currentStep === (connectToMap ? 4 : 3) && (
                <ButtonRounded
                  variant="filled"
                  text="Save"
                  className="bg-black text-white text-base pt-2 pb-2 pl-4 pr-4"
                  onClick={handleSubmit}
                />
              )}
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

      <Toast
        isShown={toastMsg.isShown}
        message={toastMsg.message}
        type={toastMsg.type}
        onClose={hideToastMessage}/>
    </>
  );
};

export default DocumentForm;
