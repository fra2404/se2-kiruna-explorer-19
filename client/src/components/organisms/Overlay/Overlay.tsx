import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Modal from 'react-modal';
import { FaFolder, FaPlus } from 'react-icons/fa';

import { modalStyles } from '../../../pages/KirunaMap';
import FloatingButton from '../../molecules/FloatingButton';
import DocumentForm from '../DocumentForm';
import { IDocument } from '../../../utils/interfaces/document.interface';
import AllDocumentsModal from '../modals/AllDocumentsModal';

import './Overlay.css';

interface OverlayProps {
  isLoggedIn: boolean | null;
  coordinates: any; //Need to pass coordinates to the modal as parameter
  setCoordinates: (coordinates: any) => void;
  documents: IDocument[];
  setDocuments: (documents: IDocument[]) => void;
}

const Overlay: React.FC<OverlayProps> = ({
  isLoggedIn,
  coordinates,
  setCoordinates,
  documents,
  setDocuments,
}) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [isHoveredSearch, setIsHoveredSearch] = useState(false)
  const [showAllDocuments, setShowAllDocuments] = useState(false)
  return (
    <Container
      fluid
      style={{
        position: 'absolute',
        top: '50vh',
        left: 0,
        width: '100%',
        zIndex: 1000,
      }}
    >
      {isLoggedIn && <FloatingButton
        text={isHovered ? '+ New Document' : <FaPlus style={{ display: 'inline' }} />}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (!modalOpen) { setModalOpen(true) }
        }}
      />}

      <FloatingButton
      onMouseEnter={() => setIsHoveredSearch(true)}
      onMouseLeave={() => setIsHoveredSearch(false)}
      onClick={() => {
        if (!showAllDocuments) { setShowAllDocuments(true) }
      }}
      text={
        isHoveredSearch ? (
          'See All Documents'
        ) : (
          <FaFolder style={{ display: 'inline' }} />
        )
      }
      className="mt-20"/>

      <Modal
        style={modalStyles}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
      >
        <DocumentForm
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          documents={documents}
          setDocuments={setDocuments}
          positionProp={undefined}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      </Modal>

      <Modal
        style={modalStyles}
        isOpen={showAllDocuments}
        onRequestClose={() => setShowAllDocuments(false)}
      >
        <AllDocumentsModal setShowAllDocuments={setShowAllDocuments} />
      </Modal>
    </Container>
  );
};

export default Overlay;