import { useState, useRef, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import Modal from 'react-modal';

import ConnectionForm from './documentConnections/ConnectionForm';
import ButtonRounded from '../atoms/button/ButtonRounded';

import {
  AgreementIcon,
  ConflictIcon,
  ConsultationIcon,
  DesignDocIcon,
  InformativeDocIcon,
  MaterialEffectsIcon,
  PrescriptiveDocIcon,
  TechnicalDocIcon,
} from '../../assets/icons';

import {
  createCoordinate,
  createDocument,
  editDocument,
  addResource,
} from '../../API';
import Toast from './Toast';
import Step1 from '../molecules/steps/Step1';
import Step2 from '../molecules/steps/Step2';
import Step3 from '../molecules/steps/Step3';
import Step4 from '../molecules/steps/Step4';
import Step5 from '../molecules/steps/Step5';
import Step6 from '../molecules/steps/Step6';
import {
  ICoordinate,
  IDocument,
} from '../../utils/interfaces/document.interface';

import './DocumentForm.css';
import LightDivider from '../atoms/light-divider/light-divider';
import ModalHeader from '../molecules/ModalHeader';
import ToggleButton from '../atoms/ToggleButton';

Modal.setAppElement('#root');

export interface Connection {
  type: string;
  relatedDocument: any;
}

interface DocumentFormProps {
  positionProp?: LatLng;
  selectedCoordIdProp?: string;
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  showCoordNamePopup?: boolean;
  documents: IDocument[];
  setDocuments: (documents: IDocument[]) => void;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  selectedDocument?: IDocument;
}

const DocumentForm = ({
  positionProp,
  selectedCoordIdProp,
  coordinates,
  setCoordinates,
  documents,
  setDocuments,
  showCoordNamePopup = false,
  selectedDocument,
  modalOpen,
  setModalOpen,
}: DocumentFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [connectToMap, setConnectToMap] = useState(
    !!positionProp || !!selectedCoordIdProp,
  );
  const [showSummary, setShowSummary] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const stepRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const scrollToStep = (step: number) => {
    setCurrentStep(step);
    stepRefs[step - 1].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  };

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
  const [title, setTitle] = useState(selectedDocument?.title || '');
  const [stakeholders, setStakeholders] = useState<string | undefined>(
    selectedDocument?.stakeholders || undefined,
  );
  const [scale, setScale] = useState<string | undefined>(
    selectedDocument?.scale || '',
  );
  const [issuanceDate, setIssuanceDate] = useState(
    selectedDocument?.date
      ? new Date(selectedDocument.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  );
  const [docType, setDocType] = useState<string | undefined>(
    selectedDocument?.type || undefined,
  );
  const [connections, setConnections] = useState<Connection[]>(
    selectedDocument?.connections?.map((c) => {
      return { type: c.type, relatedDocument: c.document };
    }) || [],
  );
  const [language, setLanguage] = useState(selectedDocument?.language || '');
  const [description, setDescription] = useState(
    selectedDocument?.summary || '',
  );

  // Georeferencing information
  const [position, setPosition] = useState<LatLng | undefined>(positionProp);
  const [selectedCoordId, setSelectedCoordId] = useState<string | undefined>(
    selectedCoordIdProp,
  );
  const [coordName, setCoordName] = useState('');
  const [coordNamePopupOpen, setCoordNamePopupOpen] =
    useState(showCoordNamePopup);

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
      maxHeight: '90vh',
      overflowY: 'auto' as React.CSSProperties['overflowY'],
    },
    overlay: { zIndex: 1000 },
  };

  // Original resources data
  const [files, setFiles] = useState<File[]>([]);
  const [showFiles, setShowFiles] = useState(!!selectedDocument?.media?.length);
  const [showConnections, setShowConnections] = useState(!!connections.length);
  const [showGeoreferencing, setShowGeoreferencing] = useState(
    !!positionProp || !!selectedCoordIdProp,
  );

  const handleAddConnection = (connection: Connection) => {
    setConnections([...connections, connection]);
  };

  const handleDeleteConnection = (index: number) => {
    const updatedConnections = connections.filter((_, i) => i !== index);
    setConnections(updatedConnections);
  };

  // Toast
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
    const newErrors: { [key: string]: string } = {};
    if (title.trim() === '') newErrors.title = 'Title is required';
    if (stakeholders === '')
      newErrors.stakeholders = 'Stakeholders are required';
    if (scale === '') newErrors.scale = 'Scale is required';
    if (issuanceDate.trim() === '')
      newErrors.issuanceDate = 'Issuance date is required';
    if ((docType ?? '').trim() === '')
      newErrors.docType = 'Document type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveResource = async () => {
    const media_ids: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const token = await addResource(files[i]);
      media_ids.push(token);
    }
    return media_ids;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) {
      showToastMessage('Please fill in all required fields', 'error');
      return;
    }

    let coordId: string | undefined = undefined;

    const media_ids = await handleSaveResource();

    if (!selectedCoordId && position && connectToMap) {
      const coordData: ICoordinate = {
        id: '',
        name: coordName,
        type: 'Point',
        coordinates: [position.lat, position.lng],
      };

      try {
        const response = await createCoordinate(coordData);
        if (response.success) {
          coordId = response.coordinate?.coordinate._id;
          if (coordId)
            setCoordinates({
              ...coordinates,
              [coordId]: {
                type: response.coordinate?.coordinate.type,
                coordinates: response.coordinate?.coordinate.coordinates,
                name: response.coordinate?.coordinate.name,
              },
            });
        } else {
          showToastMessage('Failed to create coordinate', 'error');
        }
      } catch (error) {
        showToastMessage('Error creating coordinate:' + error, 'error');
      }
    } else {
      if (connectToMap) coordId = selectedCoordId;
      else coordId = undefined;
    }

    const documentData = {
      id: selectedDocument?.id || '',
      title,
      stakeholders: stakeholders || '',
      scale: scale || '',
      type: docType || '',
      language,
      summary: description,
      date: issuanceDate,
      coordinates: coordId || undefined,
      connections: connections.map((conn) => ({
        document: conn.relatedDocument,
        type: conn.type,
      })),
      media: selectedDocument?.media
        ? [...selectedDocument.media.map((m) => m.id), ...media_ids]
        : media_ids,
    };

    try {
      let response;
      if (!selectedDocument) {
        response = await createDocument(documentData);
      } else {
        response = await editDocument(documentData);
      }
      if (response.success) {
        showToastMessage('Document saved successfully', 'success');
        setShowSummary(true);
        if (response.document) {
          const responseDocument = response.document; //Typescript is not able to detect that the value response.document will still be defined in the "else" branch. So, we have to put it in a variable
          if (!selectedDocument) {
            setDocuments(documents.concat(responseDocument));
          } else {
            setDocuments(
              documents.map((doc: IDocument) => {
                return doc.id == selectedDocument.id ? responseDocument : doc;
              }),
            );
          }
        }
      } else {
        showToastMessage('Failed to create document', 'error');
      }
    } catch (error) {
      showToastMessage('Error creating document:' + error, 'error');
    }
  };

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

  const existingFiles = selectedDocument?.media || [];

  useEffect(() => {
    const handleScroll = () => {
      stepRefs.forEach((ref, index) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            setCurrentStep(index + 1);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const hasErrors = (step: number) => {
    switch (step) {
      case 1:
        return (
          !!errors.title ||
          !!errors.stakeholders ||
          !!errors.scale ||
          !!errors.issuanceDate
        );
      case 2:
        return !!errors.docType;
      default:
        return false;
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={connectionModalStyles}
      >
        <div className="relative">
          <ModalHeader
            currentStep={currentStep}
            hasErrors={hasErrors}
            scrollToStep={scrollToStep}
            setModalOpen={setModalOpen}
            selectedDocument={selectedDocument}
          />
          <form className="m-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 mt-16">
              <div
                onClick={() => handleStepClick(1)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleStepClick(1);
                  }
                }}
                tabIndex={0} // Ensure the element is focusable
                ref={stepRefs[0]}
                className={`header-section ${hasErrors(1) ? 'error' : ''} scroll-margin-top`}
              >
                <h3 className="header-text text-xl font-bold mb-2">
                  Document Info
                </h3>
                <Step1
                  title={title}
                  setTitle={setTitle}
                  stakeholders={stakeholders || ''}
                  setStakeholders={setStakeholders}
                  scale={scale || ''}
                  setScale={setScale}
                  issuanceDate={issuanceDate}
                  setIssuanceDate={setIssuanceDate}
                  errors={errors}
                />
              </div>
              <LightDivider />
              <div
                onClick={() => handleStepClick(2)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleStepClick(2);
                  }
                }}
                tabIndex={0} // Ensure the element is focusable
                ref={stepRefs[1]}
                className={`header-section ${hasErrors(2) ? 'error' : ''} scroll-margin-top`}
              >
                <h3 className="header-text text-xl font-bold mb-2">
                  Description
                </h3>

                <Step2
                  description={description}
                  setDescription={setDescription}
                  language={language}
                  setLanguage={setLanguage}
                  docType={docType || ''}
                  setDocType={setDocType}
                  documentTypeOptions={documentTypeOptions}
                  errors={errors}
                />
              </div>
              <LightDivider />
              <div
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setShowFiles(!showFiles);
                  }
                }}
                tabIndex={0} // Ensure the element is focusable
                ref={stepRefs[2]}
                className={`header-section ${hasErrors(3) ? 'error' : ''} scroll-margin-top`}
              >
                <h3
                  className="header-text text-xl font-bold mb-2 cursor-pointer"
                  onClick={() => setShowFiles(!showFiles)}
                >
                  Files
                  <span className='align-middle'>
                    <ToggleButton
                      showContent={showFiles}
                      onToggle={() => setShowFiles(!showFiles)}
                    />
                  </span>
                </h3>
                {showFiles && (
                  <Step3
                    files={files}
                    setFiles={setFiles}
                    existingFiles={existingFiles}
                  />
                )}
              </div>
              <LightDivider />
              <div
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setShowConnections(!showConnections);
                  }
                }}
                tabIndex={0} // Ensure the element is focusable
                ref={stepRefs[3]}
                className={`header-section ${hasErrors(4) ? 'error' : ''} scroll-margin-top`}
              >
                <h3
                  className="header-text text-xl font-bold mb-2 cursor-pointer"
                  onClick={() => setShowConnections(!showConnections)}
                >
                  Connections
                  <span className='align-middle'>
                    <ToggleButton
                      showContent={showConnections}
                      onToggle={() => setShowConnections(!showConnections)}
                    />
                  </span>
                </h3>
                {showConnections && (
                  <Step4
                    connections={connections}
                    handleDeleteConnection={handleDeleteConnection}
                    setConnectionModalOpen={setConnectionModalOpen}
                    allDocuments={documents}
                  />
                )}
              </div>
              <LightDivider />
              <div
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setShowGeoreferencing(!showGeoreferencing);
                    setConnectToMap(!connectToMap)
                  }
                }}
                tabIndex={0} // Ensure the element is focusable
                ref={stepRefs[4]}
                className={`header-section ${hasErrors(5) ? 'error' : ''} scroll-margin-top`}
              >
                <h3
                  className="header-text text-xl font-bold mb-2 cursor-pointer"
                  onClick={() => {setShowGeoreferencing(!showGeoreferencing); setConnectToMap(!connectToMap)}}
                >
                  Georeferencing
                  <span className='align-middle'>
                    <ToggleButton
                      showContent={showGeoreferencing}
                      onToggle={() => {setShowGeoreferencing(!showGeoreferencing); setConnectToMap(!connectToMap)}}
                    />
                  </span>
                </h3>
                {showGeoreferencing && (
                  <Step5
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
                    MapClickHandler={MapClickHandler}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <ButtonRounded
                variant="filled"
                text="Save"
                className="bg-black text-white text-base pt-2 pb-2 pl-4 pr-4"
                onClick={handleSubmit}
              />
            </div>
          </form>
        </div>
      </Modal>

      {showSummary && (
        <Modal
          isOpen={true}
          onRequestClose={() => setShowSummary(false)}
          style={connectionModalStyles}
        >
          <div className="relative">
            <button
              onClick={() => setShowSummary(false)}
              className="absolute top-0 right-0 p-2 text-xl text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <Step6 />
          </div>
        </Modal>
      )}

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
