import { useAuth } from '../../context/AuthContext';
import { UserRoleEnum } from '../../utils/interfaces/user.interface';
import ButtonRounded from '../atoms/button/ButtonRounded';
import { DocumentIcon } from '../molecules/documentsItems/DocumentIcon';
import DocumentForm from './DocumentForm';
import { IDocument } from '../../utils/interfaces/document.interface';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CDN_URL } from '../../utils/constants';
import { nanoid } from 'nanoid';
import { scaleOptions } from '../../shared/scale.options.const';
import SidebarContext from '../../context/SidebarContext';

interface DocumentDetailsProps {
  document: IDocument;
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  allDocuments: IDocument[];
  setAllDocuments: (documents: IDocument[]) => void;
  filteredDocuments: IDocument[];
  setFilteredDocuments: (documents: IDocument[]) => void;
  page: string;
}

const DocumentDetails: React.FC<DocumentDetailsProps> = ({
  document,
  coordinates,
  setCoordinates,
  allDocuments,
  setAllDocuments,
  filteredDocuments,
  setFilteredDocuments,
  page,
}) => {
  const { isLoggedIn, user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const [connectedDocuments, setConnectedDocuments] = useState<any>([]);
  const { setSelectedDocument } = useContext(SidebarContext);
  const [documentLabel, setDocumentLabel] = useState<string>(
    document.scale === 'ARCHITECTURAL' && document.architecturalScale
      ? ` - ${document.architecturalScale}`
      : '',
  );

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
        return type; // Return the type as is if it doesn't match predefined types
    }
  };

  const getScaleLabel = (value: string): string => {
    const option = scaleOptions.find((option) => option.value === value);
    return option ? option.label : value;
  };

  useEffect(() => {
    if (!document.connections) {
      setConnectedDocuments([]);
      return;
    }

    const docs = document.connections?.map((conn) => {
      return {
        doc: allDocuments.find((doc) => doc.id === conn.document.toString()),
        type: conn.type,
      };
    });

    setConnectedDocuments(docs);
    setDocumentLabel(
      document.scale === 'ARCHITECTURAL' && document.architecturalScale
        ? ` - ${document.architecturalScale}`
        : '',
    );
  }, [document]);

  const list = [
    { label: 'Title', content: document.title },
    {
      label: 'Stakeholders',
      content: Array.isArray(document.stakeholders)
        ? document.stakeholders.map((s) => s.type).join(' - ')
        : document.stakeholders,
    },
    {
      label: 'Scale',
      content: document.scale
        ? `${getScaleLabel(document.scale)}${documentLabel}`
        : 'Unknown',
    },
    { label: 'Issuance Date', content: document.date },
    { label: 'Type', content: matchType(document.type.type) },
    {
      label: 'Connections',
      content: connectedDocuments.map((cd: any) => {
        return (
          <div
            key={cd.id}
            onClick={() => {
              setSelectedDocument(cd.doc);
            }}
          >
            <span className="text-blue-600 hover:underline cursor-pointer">
              {cd.doc?.title}
            </span>
            <span className="font-normal text-base"> - {cd.type} </span>
          </div>
        );
      }),
    },
    { label: 'Language', content: document.language },
    { label: 'Coordinates', content: document.coordinates?.name ?? 'All Municipality' },
    {
      label: 'Original Resources',
      content: document.media?.map((m, i) => {
        const separator =
          document.media && i !== document.media.length - 1 ? ' - ' : '';
        return (
          <span key={m.id}>
            <a href={CDN_URL + m.url} target="blank">
              {m.filename}
            </a>
            {m.pages ? ` (n° pag: ${m.pages})` : ''}
            {separator}
          </span>
        );
      }),
    },
  ];

  return (
    <>
      <div className="w-full p-8 grid grid-cols-12 text-sm mt-14 text-left">
        {/* Icon container */}
        <div className="col-span-2 px-2">
          <DocumentIcon
            type={document.type.type}
            stakeholders={
              Array.isArray(document.stakeholders)
                ? document.stakeholders.map((s) => ({
                    _id: s._id,
                    type: s.type,
                  }))
                : []
            }
          />
        </div>

        {/* Middle section */}
        <div className="col-start-3 col-span-10 px-2 overflow-x-hidden text-base">
          {list.map((item) => (
            <div key={nanoid()}>
              {item.label}:{' '}
              <span className="font-bold text-xl">{item.content}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description / Summary container */}
      <div className="col-start-8 col-span-5 px-2 border-t-2 text-left">
        <h3>Description:</h3>
        <p className="text-base">{document.summary}</p>
      </div>

      <div className="flex justify-end space-x-4 mr-2">
        {page == 'map' && (
          <ButtonRounded
            text="See on the diagram"
            variant="outlined"
            className="border-black text-black text-base px-4 py-2"
            onClick={() => {
              navigate('/diagram');
            }}
          />
        )}
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
      </div>
      
      <DocumentForm
        selectedCoordIdProp={document.coordinates?._id}
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        documents={allDocuments}
        setDocuments={setAllDocuments}
        filteredDocuments={filteredDocuments}
        setFilteredDocuments={setFilteredDocuments}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
};

export default DocumentDetails;
