import React, { useState } from 'react';
import Modal from 'react-modal';

import { modalStyles } from '../../../pages/KirunaMap';
import FloatingButton from '../../molecules/FloatingButton';
import DocumentForm from '../DocumentForm';
import { IDocument } from '../../../utils/interfaces/document.interface';
import AllDocumentsModal from '../modals/AllDocumentsModal';
import { FaFolder, FaGlobe, FaPlus } from 'react-icons/fa';
import { AllMunicipalityDocuments } from '../coordsOverlay/AllMunicipalityDocuments';
import { useAuth } from '../../../context/AuthContext';
import { UserRoleEnum } from '../../../utils/interfaces/user.interface';
import './Overlay.css';

interface OverlayProps {
  coordinates: any; //Need to pass coordinates to the modal as parameter
  setCoordinates: (coordinates: any) => void;
  documents: IDocument[];
  setDocuments: (documents: IDocument[]) => void;
}

const Overlay: React.FC<OverlayProps> = ({
  coordinates,
  setCoordinates,
  documents,
  setDocuments
}) => {
  const [isHoveredMunicipality, setIsHoveredMunicipality] = useState(false);
  const [showMunicipalityDocuments, setShowMunicipalityDocuments] =
    useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [isHoveredNewDocument, setIsHoveredNewDocument] = useState(false);

  const [isHoveredSearch, setIsHoveredSearch] = useState(false);
  const [showAllDocumentsModal, setShowAllDocumentsModal] = useState(false);
  const { isLoggedIn, user } = useAuth();

  const municipalityDocumentsModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      height: '90vh',
    },
    overlay: { zIndex: 1000 },
  };

  return (
    <div style={{
        position: 'absolute',
        top: '50vh',
        left: 0,
        width: '100%',
        transform: '350ms',
        zIndex: 1000,
      }}
    >
      <FloatingButton
        text={
          isHoveredMunicipality ? (
            'All Municipality Documents'
          ) : (
            <FaGlobe style={{ display: 'inline' }} />
          )
        }
        onMouseEnter={() => setIsHoveredMunicipality(true)}
        onMouseLeave={() => setIsHoveredMunicipality(false)}
        onClick={() => {
          if (!modalOpen) {
            setShowMunicipalityDocuments(true);
          }
        }}
        className='floating-button-right'
      />

      <FloatingButton
        onMouseEnter={() => setIsHoveredSearch(true)}
        onMouseLeave={() => setIsHoveredSearch(false)}
        onClick={() => {
          if (!showAllDocumentsModal) {
            setShowAllDocumentsModal(true);
          }
        }}
        text={
          isHoveredSearch ? (
            'See All Documents'
          ) : (
            <FaFolder style={{ display: 'inline' }} />
          )
        }
        className="floating-button-right mt-20"
      />

      {isLoggedIn && user && user.role === UserRoleEnum.Uplanner && (
        <FloatingButton
          text={
            isHoveredNewDocument ? (
              '+ New Document'
            ) : (
              <FaPlus style={{ display: 'inline' }} />
            )
          }
          onMouseEnter={() => setIsHoveredNewDocument(true)}
          onMouseLeave={() => setIsHoveredNewDocument(false)}
          onClick={() => {
            if (!modalOpen) {
              setModalOpen(true);
            }
          }}
          className='floating-button-right mt-40'
        />
      )}

      <Modal
        style={modalStyles}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
      >
        <DocumentForm
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          documents={documents}
          positionProp={undefined}
          setModalOpen={setModalOpen}
          setDocuments={setDocuments} 
        />
      </Modal>

      <Modal
        style={modalStyles}
        isOpen={showAllDocumentsModal}
        onRequestClose={() => setShowAllDocumentsModal(false)}
      >
        <AllDocumentsModal 
          setShowAllDocumentsModal={setShowAllDocumentsModal} 
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          allDocuments={documents}
          setAllDocuments={setDocuments} 
        />
      </Modal>

      <Modal
        style={municipalityDocumentsModalStyles}
        isOpen={showMunicipalityDocuments}
        onRequestClose={() => setShowMunicipalityDocuments(false)}
      >
        <AllMunicipalityDocuments
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          documents={documents}
          setDocuments={setDocuments} 
        />
      </Modal>
    </div>
  );
};

export default Overlay;