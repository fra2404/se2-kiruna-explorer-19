import { useAuth } from '../../../context/AuthContext';
import { modalStyles } from '../../../pages/KirunaMap';
import { UserRoleEnum } from '../../../utils/interfaces/user.interface';
import ButtonRounded from '../../atoms/button/ButtonRounded';
import { DocumentIcon } from '../../molecules/documentsItems/DocumentIcon';
import Modal from 'react-modal';
import DocumentForm from '../DocumentForm';
import { IDocument } from '../../../utils/interfaces/document.interface';
import { useState, useEffect } from 'react';
import { CDN_URL } from '../../../utils/constants';
import { nanoid } from 'nanoid';
import { scaleOptions } from '../../../shared/scale.options.const';
import API from '../../../API';

interface DocumentDetailsModalProps {
  document: IDocument;
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  allDocuments: IDocument[];
  setAllDocuments: (documents: IDocument[]) => void;
  filteredDocuments: IDocument[];
  setFilteredDocuments: (documents: IDocument[]) => void;
}

const DocumentDetailsModal: React.FC<DocumentDetailsModalProps> = ({
  document,
  coordinates,
  setCoordinates,
  allDocuments,
  setAllDocuments,
  filteredDocuments,
  setFilteredDocuments
}) => {
  console.log('DocumentDetailsModal - document:', document);
  const { isLoggedIn, user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [connectedDocuments, setConnectedDocuments] = useState<IDocument[]>([]);
  const [currentDocument, setCurrentDocument] = useState<IDocument>(document);
  const [documentLabel, setDocumentLabel] = useState<string>('');

  const matchType = (type: string) => {
    switch (type) {
      case 'AGREEMENT':
        return 'Agreement';
      case 'CONFLICT':
        return 'Conflict';
      case 'CONSULTATION':
        return 'Consultation';
      case 'DESIGN_DOC':
        return 'Design Document';
      case 'INFORMATIVE_DOC':
        return 'Informative Document';
      case 'MATERIAL_EFFECTS':
        return 'Material Effects';
      case 'PRESCRIPTIVE_DOC':
        return 'Prescriptive Document';
      case 'TECHNICAL_DOC':
        return 'Technical Document';
      default:
        return 'Unknown';
    }
  };

  const getScaleLabel = (value: string): string => {
    const option = scaleOptions.find((option) => option.value === value);
    return option ? option.label : value;
  };

  useEffect(() => {
    if (!currentDocument || !currentDocument.connections) {
      setConnectedDocuments([]); // Réinitialiser si le document change
      return;
    }

    const fetchConnectedDocuments = async () => {
      try {
        // Récupérer tous les documents liés via leurs IDs
        const documentFetchPromises = currentDocument.connections?.map((connection) =>
          API.getDocumentById(connection.document.toString())
        );

        // Attendre les résultats
        const documents = await Promise.all(documentFetchPromises as Promise<IDocument>[]);

        // Mettre à jour l'état
        setConnectedDocuments(documents);
      } catch (error) {
        console.error("Erreur lors de la récupération des documents connectés :", error);
        setConnectedDocuments([]);
      }
    };

    fetchConnectedDocuments();
    setDocumentLabel(currentDocument.scale === 'ARCHITECTURAL' && currentDocument.architecturalScale ? ` - ${currentDocument.architecturalScale}` : '');
  }, [currentDocument]);

//  const documentLabel = currentDocument.scale === 'ARCHITECTURAL' && currentDocument.architecturalScale ? ` - ${currentDocument.architecturalScale}` : '';

  const list = [
    { label: 'Title', content: currentDocument.title },
    {
      label: 'Stakeholders',
      content: Array.isArray(currentDocument.stakeholders)
        ? currentDocument.stakeholders.join(' - ')
        : currentDocument.stakeholders,
    },
    {
      label: 'Scale',
      content: currentDocument.scale
        ? `${getScaleLabel(currentDocument.scale)}${documentLabel}`
        : 'Unknown',
    },
    { label: 'Issuance Date', content: currentDocument.date },
    { label: 'Type', content: matchType(currentDocument.type) },
    { 
      label: 'Connections', 
      content: connectedDocuments.map((cd, index) => {
        return (
          <>
            <span key={cd.id} onClick={()=>{setCurrentDocument(cd)}}
            className='text-blue-600 hover:underline cursor-pointer'>{cd.title}</span>
            <span>{index !== currentDocument.connections.length - 1 && " , "}</span>
          </>
        )
      }) 
    },
    { label: 'Language', content: currentDocument.language },
    { label: 'Coordinates', content: currentDocument.coordinates?.name },
    {
      label: 'Original Resources',
      content: currentDocument.media?.map((m, i) => {
        const separator =
        currentDocument.media && i !== currentDocument.media.length - 1 ? ' - ' : '';
        return (
          <span key={m.id}>
            <a href={CDN_URL + m.url} target="blank">
              {m.filename}
            </a>
            {separator}
          </span>
        );
      }),
    },
  ];

  return (
    <>
      <div className="w-full p-8 grid grid-cols-12 text-sm">
        {/* Icon container */}
        <div className="col-span-2 px-2">
          <DocumentIcon
            type={currentDocument.type}
            stakeholders={
              Array.isArray(currentDocument.stakeholders) ? currentDocument.stakeholders : []
            }
          />
        </div>

        {/* Middle section */}
        <div className="col-start-3 col-span-5 border-r border-l px-2 overflow-x-hidden">
          {list.map((item) => (
            <div key={nanoid()}>
              {item.label}: <span className="font-bold">{item.content}</span>
            </div>
          ))}
        </div>

        {/* Description / Summary container */}
        <div className="col-start-8 col-span-5 px-2">
          <h1>Description:</h1>
          <p>{currentDocument.summary}</p>
        </div>
      </div>

      {
        /* Button to edit the document */
        isLoggedIn && user && user.role === UserRoleEnum.Uplanner && (
          <ButtonRounded
            text="Edit"
            variant="filled"
            className="bg-black text-white text-base px-4 py-2"
            onClick={() => {
              setModalOpen(true);
            }}
          />
        )
      }

      <Modal
        style={modalStyles}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
      >
        <DocumentForm
          selectedCoordIdProp={currentDocument.coordinates?._id}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          documents={allDocuments}
          setDocuments={setAllDocuments}
          filteredDocuments={filteredDocuments}
          setFilteredDocuments={setFilteredDocuments}
          setModalOpen={setModalOpen}
          selectedDocument={currentDocument}
        />
      </Modal>
    </>
  );
};

export default DocumentDetailsModal;
