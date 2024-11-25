import { useState } from 'react';
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
  const [title, setTitle] = useState(selectedDocument?.title ?? '');
  const [stakeholders, setStakeholders] = useState<string | undefined>(
    selectedDocument?.stakeholders ?? undefined,
  );
  const [scale, setScale] = useState<string | undefined>(
    selectedDocument?.scale ?? '',
  );
  const [issuanceDate, setIssuanceDate] = useState(
    selectedDocument?.date
      ? new Date(selectedDocument.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  );
  const [docType, setDocType] = useState<string | undefined>(
    selectedDocument?.type ?? undefined,
  );
  //const [numPages, setNumPages] = useState(0);
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
  ); //If the user selected an area, this variable contains the id of that area
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
    },
    overlay: { zIndex: 1000 },
  };

  // Original resources data
  const [files, setFiles] = useState<File[]>([]);

  const handleAddConnection = (connection: Connection) => {
    setConnections([...connections, connection]);
  };

  const handleDeleteConnection = (index: number) => {
    const updatedConnections = connections.filter((_, i) => i !== index);
    setConnections(updatedConnections);
  };

  // const handleEditConnection = (
  //   index: number,
  //   updatedConnection: Connection,
  // ) => {
  //   const updatedConnections = connections.map((conn, i) =>
  //     i === index ? updatedConnection : conn,
  //   );
  //   setConnections(updatedConnections);
  // };

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
      console.log(currentStep);
      setCurrentStep(currentStep + 1);
    } else {
      showToastMessage('Please fill in all required fields', 'error');
    }
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
    let coordId: string | undefined = undefined;

    // Call here the API to save the media files
    const media_ids = await handleSaveResource();

    //If selectedCoordId is undefined, this means that we are adding the document into a new point. We need to save this point in the DB
    if (!selectedCoordId && position && connectToMap) {
      const coordData: ICoordinate = {
        id: '',
        name: coordName,
        type: 'Point', //TODO: will be changed at story 9, to give the possibility to also create areas
        coordinates: [position.lat, position.lng], //TODO: will be changed at story 9, to give the possibility to also create areas
      };

      try {
        const response = await createCoordinate(coordData);
        console.log(response);
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
          console.log('Failed to create coordinate');
          showToastMessage('Failed to create coordinate', 'error');
        }
      } catch (error) {
        console.error('Error creating coordinate:', error);
        showToastMessage('Error creating coordinate:' + error, 'error');
      }
    } else {
      if (connectToMap) 
        coordId = selectedCoordId;
      else 
        coordId = undefined;
    }

    const documentData = {
      id: selectedDocument?.id ?? '',
      title,
      stakeholders: stakeholders ?? '',
      scale: scale ?? '',
      type: docType ?? '',
      language,
      summary: description,
      date: issuanceDate,
      coordinates: coordId ?? undefined,
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

        setCurrentStep(6);
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

  const existingFiles = selectedDocument?.media || [];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            title={title}
            setTitle={setTitle}
            stakeholders={stakeholders ?? ''}
            setStakeholders={setStakeholders}
            scale={scale ?? ''}
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
            docType={docType ?? ''}
            setDocType={setDocType}
            documentTypeOptions={documentTypeOptions}
          />
        );
      case 3:
        return (
          <Step3
            files={files}
            setFiles={setFiles}
            existingFiles={existingFiles}
          />
        );
      case 4:
        return (
          <Step4
            connections={connections}
            handleDeleteConnection={handleDeleteConnection}
            setConnectionModalOpen={setConnectionModalOpen}
            connectToMap={connectToMap}
            setConnectToMap={setConnectToMap}
            allDocuments={documents}
          />
        );
      case 5:
        return (
          <Step5
            coordinates={coordinates}
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
          />
        );
      case 6:
        return <Step6 />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full rounded shadow-md border">
        <h2 className="text-center text-2xl font-bold mt-6">
          {selectedDocument ? 'Edit document' : 'Create a new document'}
        </h2>
        <form className="m-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            {renderStep()}

            {/* Navigation buttons */}
            <div className="col-span-2 flex justify-between mt-4">
              {currentStep > 1 && currentStep < 6 && (
                <ButtonRounded
                  variant="outlined"
                  text="Previous"
                  className="text-base pt-2 pb-2 pl-4 pr-4"
                  onClick={() => setCurrentStep(currentStep - 1)}
                />
              )}
              {/** (connectToMap ? 5 : 4) */}
              {currentStep < (connectToMap ? 5 : 4) && (
                <ButtonRounded
                  variant="filled"
                  text="Next"
                  className="bg-black text-white text-base pt-2 pb-2 pl-4 pr-4"
                  onClick={handleNextStep}
                />
              )}
              {currentStep === (connectToMap ? 5 : 4) && (
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
