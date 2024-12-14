import { useAuth } from '../../context/AuthContext';
import { modalStyles } from '../../pages/KirunaMap';
import { UserRoleEnum } from '../../utils/interfaces/user.interface';
import ButtonRounded from '../atoms/button/ButtonRounded';
import { DocumentIcon } from '../molecules/documentsItems/DocumentIcon';
import Modal from 'react-modal';
import DocumentForm from './DocumentForm';
import { IDocument } from '../../utils/interfaces/document.interface';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CDN_URL } from '../../utils/constants';
import { nanoid } from 'nanoid';
import { scaleOptions } from '../../shared/scale.options.const';

interface DocumentDetailsProps {
  document: IDocument;
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  allDocuments: IDocument[];
  setAllDocuments: (documents: IDocument[]) => void;
  filteredDocuments: IDocument[];
  setFilteredDocuments: (documents: IDocument[]) => void;
}

const DocumentDetails: React.FC<DocumentDetailsProps> = ({
  document,
  coordinates,
  setCoordinates,
  allDocuments,
  setAllDocuments,
  filteredDocuments,
  setFilteredDocuments
}) => {
  const { isLoggedIn, user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();


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

  const documentLabel = document.scale === 'ARCHITECTURAL' && document.architecturalScale ? ` - ${document.architecturalScale}` : '';

  const list = [
    { label: 'Title', content: document.title },
    {
      label: 'Stakeholders',
      content: Array.isArray(document.stakeholders)
        ? document.stakeholders.join(' - ')
        : document.stakeholders,
    },
    {
      label: 'Scale',
      content: document.scale
        ? `${getScaleLabel(document.scale)}${documentLabel}`
        : 'Unknown',
    },
    { label: 'Issuance Date', content: document.date },
    { label: 'Type', content: matchType(document.type) },
    { label: 'Connections', content: document.connections?.length.toString() },
    { label: 'Language', content: document.language },
    { label: 'Coordinates', content: document.coordinates?.name },
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
            type={document.type}
            stakeholders={
              Array.isArray(document.stakeholders) ? document.stakeholders : []
            }
          />
        </div>

        {/* Middle section */}
        <div className="col-start-3 col-span-10 px-2 overflow-x-hidden text-base">
          {list.map((item) => (
            <div key={nanoid()}>
              {item.label}: <span className="font-bold text-xl">{item.content}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description / Summary container */}
      <div className="col-start-8 col-span-5 px-2 border-t-2 text-left">
        <h3>Description:</h3>
        <p className='text-base'>{document.summary}</p>
      </div>

      <div className="flex justify-end space-x-4">
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

        <ButtonRounded
          text="See on the diagram"
          variant="outlined"
          className="border-black text-black text-base px-4 py-2"
          onClick={() => {
            console.log('Navigate to node:', document.id);
            // Call the navigate function with the node id
            navigate('/diagram/' + document.id);

          }}
        />
      </div>
      <Modal
        style={modalStyles}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
      >
        <DocumentForm
          selectedCoordIdProp={document.coordinates?._id}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          documents={allDocuments}
          setDocuments={setAllDocuments}
          filteredDocuments={filteredDocuments}
          setFilteredDocuments={setFilteredDocuments}
          setModalOpen={setModalOpen}
          selectedDocument={document}
        />
      </Modal>
    </>
  );
};

export default DocumentDetails;
