import { useState, useRef, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import Modal from 'react-modal';
import ConnectionForm from './documentConnections/ConnectionForm';
import ButtonRounded from '../atoms/button/ButtonRounded';

import {
  createDocument,
  editDocument,
  addResource,
  getDocumentTypes,
} from '../../API';
import Toast from './Toast';
import Step1 from '../molecules/steps/Step1';
import Step2 from '../molecules/steps/Step2';
import Step3 from '../molecules/steps/Step3';
import Step4 from '../molecules/steps/Step4';
import Step5 from '../molecules/steps/Step5';
import Step6 from '../molecules/steps/Step6';
import { IDocument } from '../../utils/interfaces/document.interface';

import './DocumentForm.css';
import LightDivider from '../atoms/light-divider/light-divider';
import ModalHeader from '../molecules/ModalHeader';
import ToggleButton from '../atoms/ToggleButton';
import { DocumentIcon } from '../molecules/documentsItems/DocumentIcon';
import useToast from '../../utils/hooks/toast';
import { isMarkerInsideKiruna } from '../../utils/isMarkerInsideKiruna';
import { IStakeholder } from '../../utils/interfaces/stakeholders.interface';

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
  filteredDocuments: IDocument[];
  setFilteredDocuments: (documents: IDocument[]) => void;
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
  filteredDocuments,
  setFilteredDocuments,
  showCoordNamePopup = false,
  selectedDocument,
  setModalOpen,
}: DocumentFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [connectToMap, setConnectToMap] = useState(
    !!positionProp || !!selectedCoordIdProp,
  );
  const [showSummary, setShowSummary] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const popupRef = useRef<L.Popup>(null);

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

  // Document information
  const [title, setTitle] = useState(selectedDocument?.title ?? '');
  const [stakeholders, setStakeholders] = useState<IStakeholder[]>(
    Array.isArray(selectedDocument?.stakeholders)
      ? selectedDocument.stakeholders.map((s) => ({
          _id: s._id,
          id: s._id,
          type: s.type,
        }))
      : [],
  );
  const [scale, setScale] = useState<string | undefined>(
    selectedDocument?.scale ?? '',
  );
  const [architecturalScale, setArchitecturalScale] = useState<
    string | undefined
  >(selectedDocument?.architecturalScale ?? '');
  const [issuanceDate, setIssuanceDate] = useState(
    selectedDocument?.date
      ? new Date(selectedDocument.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  );
  const [docType, setDocType] = useState<
    { _id: string; type: string } | undefined
  >(
    selectedDocument?.type
      ? { _id: selectedDocument.type._id, type: selectedDocument.type.type }
      : undefined,
  );
  const [connections, setConnections] = useState<Connection[]>(
    selectedDocument?.connections?.map((c) => {
      return { type: c.type, relatedDocument: c.document };
    }) || [],
  );
  const [language, setLanguage] = useState(selectedDocument?.language ?? '');
  const [description, setDescription] = useState(
    selectedDocument?.summary ?? '',
  );

  // Georeferencing information
  const [position, setPosition] = useState<LatLng | undefined>(positionProp);
  const [selectedCoordId, setSelectedCoordId] = useState<string | undefined>(
    selectedCoordIdProp,
  );
  const [coordName, setCoordName] = useState('');
  const [coordNamePopupOpen, setCoordNamePopupOpen] =
    useState(showCoordNamePopup);

  const createDocumentOption = (
    value: string,
    label: string,
    stakeholders: IStakeholder[] | undefined,
  ) => ({
    value,
    label,
    icon: (
      <DocumentIcon
        type={label}
        stakeholders={
          Array.isArray(stakeholders)
            ? stakeholders.map((s) => ({ _id: s._id, type: s.type }))
            : []
        }
      />
    ),
  });

  const [documentTypeOptions, setDocumentTypeOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    // Function that retrieves document types from the backend
    const fetchDocumentTypes = async () => {
      try {
        const options = await getDocumentTypes();
        setDocumentTypeOptions(
          options.map((o) =>
            createDocumentOption(o.value, o.label, stakeholders),
          ),
        );
      } catch (error) {
        console.error('Error when retrieving document types:', error);
      }
    };

    fetchDocumentTypes();
  }, []);

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
  const { toast, showToast, hideToast } = useToast();

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};
    if (title.trim() === '') newErrors.title = 'Title is required';
    if (stakeholders.length === 0)
      newErrors.stakeholders = 'Stakeholders are required';
    if (scale === '') newErrors.scale = 'Scale is required';
    if (
      scale === 'ARCHITECTURAL' &&
      ((architecturalScale ?? '').trim() === '' ||
        !/^1:\d+$/.test(architecturalScale ?? ''))
    )
      newErrors.architecturalScale = 'Custom Scale must be in 1:number format';
    if (issuanceDate.trim() === '')
      newErrors.issuanceDate = 'Issuance date is required';
    if (!docType || (docType._id ?? '').trim() === '')
      newErrors.docType = 'Document type is required';
    if (position && !selectedCoordId && !coordName)
      newErrors.newPoint = 'A new point must have a valid name';
    if (position && !selectedCoordId && !isMarkerInsideKiruna(position))
      newErrors.newPoint = 'Point must be inside of Kiruna Borders';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveResource = async () => {
    const media_ids: string[] = [];
    // Call here the API to save the media file for each file:
    for (let f of files) {
      const token = await addResource(f);
      media_ids.push(token);
    }
    return media_ids;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const media_ids = await handleSaveResource();

    const documentData = createDocumentData(media_ids);

    try {
      const response = await saveDocument(documentData);
      if (response.success) {
        if (response.document) {
          handleSuccessfulSave(response.document);
        } else {
          showToast('Failed to create document', 'error');
        }
      } else {
        showToast('Failed to create document', 'error');
      }
    } catch (error) {
      showToast('Error creating document:' + error, 'error');
    }
  };

  const createDocumentData = (media_ids: string[]) => {
    return {
      id: selectedDocument?.id ?? '',
      title,
      stakeholders: stakeholders.map((s) => s._id),
      scale: scale ?? '',
      architecturalScale: scale === 'ARCHITECTURAL' ? architecturalScale : '',
      type: docType?._id ?? '',
      language,
      summary: description,
      date: issuanceDate,
      coordinates: connectToMap ? selectedCoordId : undefined,
      connections: connections.map((conn) => ({
        document: conn.relatedDocument,
        type: conn.type,
      })),
      media: selectedDocument?.media
        ? [...selectedDocument.media.map((m) => m.id), ...media_ids]
        : media_ids,
    };
  };

  const saveDocument = async (documentData: any) => {
    if (!selectedDocument) {
      return await createDocument(documentData);
    } else {
      return await editDocument(documentData);
    }
  };

  const handleSuccessfulSave = (responseDocument: IDocument) => {
    showToast('Document saved successfully', 'success');
    setShowSummary(true);
    if (responseDocument) {
      if (!selectedDocument) {
        setDocuments(documents.concat(responseDocument));
      } else {
        setDocuments(
          documents.map((doc: IDocument) => {
            return doc.id == selectedDocument.id ? responseDocument : doc;
          }),
        );
        setFilteredDocuments(
          filteredDocuments.map((doc: IDocument) => {
            return doc.id == selectedDocument.id ? responseDocument : doc;
          }),
        );
      }
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
          !!errors.architecturalScale ||
          !!errors.issuanceDate ||
          !!errors.customScale
        );
      case 2:
        return !!errors.docType;
      case 5:
        return !!errors.newPoint;
      default:
        return false;
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <>
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
                stakeholders={stakeholders}
                setStakeholders={setStakeholders}
                scale={scale ?? ''}
                setScale={setScale}
                issuanceDate={issuanceDate}
                setIssuanceDate={setIssuanceDate}
                architecturalScale={architecturalScale ?? ''}
                setArchitecturalScale={setArchitecturalScale}
                errors={errors}
              />
            </div>
            <LightDivider />
            <div
              onClick={() => handleStepClick(2)}
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
                docType={docType ?? { _id: '', type: '' }}
                setDocType={setDocType}
                documentTypeOptions={documentTypeOptions}
                setDocumentTypeOptions={setDocumentTypeOptions}
                stakeholders={stakeholders}
                errors={errors}
              />
            </div>
            <LightDivider />
            <div
              onClick={() => handleStepClick(3)}
              tabIndex={0} // Ensure the element is focusable
              ref={stepRefs[2]}
              className={`header-section ${hasErrors(3) ? 'error' : ''} scroll-margin-top`}
            >
              <h3
                className="header-text text-xl font-bold mb-2 cursor-pointer"
                onClick={() => {
                  setShowFiles(!showFiles);
                }}
              >
                Files
                {/*
                 */}
                <span className="align-middle">
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
              onClick={() => handleStepClick(4)}
              tabIndex={0} // Ensure the element is focusable
              ref={stepRefs[3]}
              className={`header-section ${hasErrors(4) ? 'error' : ''} scroll-margin-top`}
            >
              <h3
                className="header-text text-xl font-bold mb-2 cursor-pointer"
                onClick={() => setShowConnections(!showConnections)}
              >
                Connections
                {/*
                 */}
                <span className="align-middle">
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
              onClick={() => handleStepClick(5)}
              tabIndex={0} // Ensure the element is focusable
              ref={stepRefs[4]}
              className={`header-section ${hasErrors(5) ? 'error' : ''} scroll-margin-top`}
            >
              <h3
                className="header-text text-xl font-bold mb-2 cursor-pointer"
                onClick={() => {
                  setShowGeoreferencing(!showGeoreferencing);
                  setConnectToMap(!connectToMap);
                  featureGroupRef.current?.remove();
                  popupRef.current?.remove();
                }}
              >
                Georeferencing
                {/*
                 */}
                <span className="align-middle">
                  <ToggleButton
                    showContent={showGeoreferencing}
                    onToggle={() => {
                      setShowGeoreferencing(!showGeoreferencing);
                      setConnectToMap(!connectToMap);
                    }}
                  />
                </span>
              </h3>
              {showGeoreferencing && (
                <Step5
                  coordinates={coordinates}
                  setCoordinates={setCoordinates}
                  showToastMessage={showToast}
                  selectedCoordIdProp={selectedCoordId ?? ''}
                  selectedCoordId={selectedCoordId ?? ''}
                  setSelectedCoordId={setSelectedCoordId}
                  setCoordNamePopupOpen={setCoordNamePopupOpen}
                  position={position}
                  setPosition={setPosition}
                  coordNamePopupOpen={coordNamePopupOpen}
                  coordName={coordName}
                  setCoordName={setCoordName}
                  MapClickHandler={MapClickHandler}
                  errors={errors}
                  featureGroupRef={featureGroupRef}
                  popupRef={popupRef}
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

          {toast.isShown && (
            <Toast
              isShown={toast.isShown}
              message={toast.message}
              type={toast.type}
              onClose={hideToast}
            />
          )}
        </form>
      </div>

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
    </>
  );
};

export default DocumentForm;
