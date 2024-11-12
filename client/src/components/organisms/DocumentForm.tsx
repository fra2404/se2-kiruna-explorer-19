import { useState } from 'react';
import ConnectionForm from './ConnectionForm';
import Modal from 'react-modal';
import { kirunaLatLngCoords } from '../../pages/KirunaMap';
import { useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import ButtonRounded from '../atoms/button/ButtonRounded';
import AgreementIcon from '../../assets/icons/agreement-icon';
import ConflictIcon from '../../assets/icons/conflict-icon';
import ConsultationIcon from '../../assets/icons/consultation-icon';
import DesignDocIcon from '../../assets/icons/design-doc-icon';
import InformativeDocIcon from '../../assets/icons/informative-doc-icon';
import MaterialEffectsIcon from '../../assets/icons/material-effects-icon';
import PrescriptiveDocIcon from '../../assets/icons/prescriptive-doc-icon';
import TechnicalDocIcon from '../../assets/icons/technical-doc-icon';
import { createDocument } from '../../API';
import Toast from './Toast';
import Step1 from '../molecules/steps/Step1';
import Step2 from '../molecules/steps/Step2';
import Step3 from '../molecules/steps/Step3';
import Step4 from '../molecules/steps/Step4';
import Step5 from '../molecules/steps/Step5';

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
    if (!connections.some(conn => conn.type === connection.type && conn.relatedDocument.value === connection.relatedDocument.value)) {
      setConnections([...connections, connection]);
      console.log('sono qui', connections);
      return;
    }
    showToastMessage('Connection already exists', 'error');
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
  const [toastMsg, setToastMsg] = useState<{
    isShown: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    isShown: false,
    type: 'success',
    message: '',
  });

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const hideToastMessage = () => {
    setToastMsg({
      isShown: false,
      message: '',
      type: 'error',
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
        showToastMessage('Document created successfully', 'success');

        setIsDocumentSaved(true);
        setCurrentStep(5);
      } else {
        console.log('Failed to create document');
        showToastMessage('Failed to create document', 'error');
      }
    } catch (error) {
      console.error('Error creating document:', error);
      showToastMessage('Error creating document:' + error, 'error');
    }
  };

  // Handle document position
  function MapClickHandler() {
    useMapEvents({
      dblclick(e) {
        setSelectedCoordId(undefined);
        setPosition(e.latlng);
        setCoordNamePopupOpen(true);
      },
    });
    return null;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            title={title}
            setTitle={setTitle}
            stakeholders={stakeholders || ''}
            setStakeholders={setStakeholders}
            scale={scale || ''}
            setScale={setScale}
            issuanceDate={issuanceDate}
            setIssuanceDate={setIssuanceDate}
          />
        );
      case 2:
        return (
          <Step2
            description={description}
            setDescription={setDescription}
            language={language}
            setLanguage={setLanguage}
            docType={docType || ''}
            setDocType={setDocType}
            documentTypeOptions={documentTypeOptions}
          />
        );
      case 3:
        return (
          <Step3
            connections={connections}
            handleDeleteConnection={handleDeleteConnection}
            setConnectionModalOpen={setConnectionModalOpen}
            connectToMap={connectToMap}
            setConnectToMap={setConnectToMap}
          />
        );
      case 4:
        return (
          <Step4
            coordinates={coordinates}
            selectedCoordIdProp={selectedCoordId || ''}
            selectedCoordId={selectedCoordId || ''}
            setSelectedCoordId={setSelectedCoordId}
            setCoordNamePopupOpen={setCoordNamePopupOpen}
            position={position}
            setPosition={setPosition}
            coordNamePopupOpen={coordNamePopupOpen}
            coordName={coordName}
            setCoordName={setCoordName}
            kirunaLatLngCoords={kirunaLatLngCoords}
            MapClickHandler={MapClickHandler}
          />
        );
      case 5:
        return <Step5 />;
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
            connection={{ type: '', relatedDocument: {} }}
          />
        </div>
      </Modal>

      {toastMsg.isShown && (
        <Toast
          isShown={toastMsg.isShown}
          message={toastMsg.message}
          type={toastMsg.type}
          onClose={hideToastMessage}
        />
      )}
    </>
  );
};

export default DocumentForm;
