import { useAuth } from '../../../context/AuthContext';
import { modalStyles } from '../../../pages/KirunaMap';
import { UserRoleEnum } from '../../../utils/interfaces/user.interface';
import ButtonRounded from '../../atoms/button/ButtonRounded';
import { DocumentIcon } from '../../molecules/documentsItems/DocumentIcon';
import Modal from 'react-modal';
import DocumentForm from '../DocumentForm';
import { IDocument } from '../../../utils/interfaces/document.interface';
import { useState } from 'react';

interface DocumentDetailsModalProps {
    document: IDocument;
    coordinates: any;
    setCoordinates: (coordinates: any) => void;
    allDocuments: IDocument[];
    setDocuments: (documents: IDocument[]) => void;
}

const DocumentDetailsModal: React.FC<DocumentDetailsModalProps> = ({
    document,
    coordinates,
    setCoordinates,
    allDocuments,
    setDocuments
}) => {
    const CDN_URL = 'http://localhost:3004'; // endpoint of the CDN

    const { isLoggedIn, user } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);

    const matchType = (type: string) => {
        switch (type) {
            case "AGREEMENT":
                return "Agreement";
            case "CONFLICT":
                return "Conflict";
            case "CONSULTATION":
                return "Consultation";
            case "DESIGN_DOC":
                return "Design Document";
            case "INFORMATIVE_DOC":
                return "Informative Document";
            case "MATERIAL_EFFECTS":
                return "Material Effects";
            case "PRESCRIPTIVE_DOC":
                return "Prescriptive Document";
            case "TECHNICAL_DOC":
                return "Technical Document";
            default: 
                return "Unknown";
        }
    }

    const list = [
        { label: "Title", content: document.title },
        { label: "Stakeholders", content: document.stakeholders },
        { label: "Scale", content: document.scale },
        { label: "Issuance Date", content: document.date },
        { label: "Type", content: matchType(document.type) },
        { label: "Connections", content: document.connections?.length.toString() },
        { label: "Language", content: document.language },
        { label: "Coordinates", content: document.coordinates?.name },
        { label: "Original Resources", content: document.media?.map((m) => {
                return <a href={CDN_URL + m.url} target='blank' key={m.url}>{m.filename}</a>
            })
        }
    ]
    
    return (
        <>
            <div className="w-full p-8 grid grid-cols-12 text-sm">
                {/* Icon container */}
                <div className="col-span-2 px-2">
                    <DocumentIcon type={document.type} stakeholders={document.stakeholders} />
                </div>

                {/* Middle section */}
                <div className="col-start-3 col-span-5 border-r border-l px-2 overflow-x-hidden">
                    {list.map((item, index) => (
                        <div key={index}>{item.label}: <span className="font-bold">{item.content}</span></div>
                    ))}
                </div>

                {/* Description / Summary container */}
                <div className="col-start-8 col-span-5 px-2">
                    <h1>Description:</h1>
                    <p>{document.summary}</p>
                </div>
            </div>

            {
                /* Button to edit the document */
                (isLoggedIn && user && user.role === UserRoleEnum.Uplanner) &&
                <ButtonRounded
                    text="Edit"
                    variant="filled" 
                    className="bg-black text-white text-base px-4 py-2"
                    onClick={() => {setModalOpen(true)}}
                />
            }

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
                    setDocuments={setDocuments}
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    selectedDocument={document}
                />
            </Modal>
        </>
    );
};

export default DocumentDetailsModal;