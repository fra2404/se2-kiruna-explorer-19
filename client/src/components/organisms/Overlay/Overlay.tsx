import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Modal from 'react-modal';
import { modalStyles } from '../../../pages/KirunaMap';
import './Overlay.css';
import FloatingButton from '../../molecules/FloatingButton';
import DocumentForm from '../DocumentForm';

interface OverlayProps {
  coordinates: any; //Need to pass coordinates to the modal as parameter
}

const Overlay: React.FC<OverlayProps> = ({ coordinates }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      <FloatingButton
        text={isHovered ? '+ New Document' : '+'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (!modalOpen) {
            setModalOpen(true);
          }
        }}
      />
      <Modal
        style={modalStyles}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
      >
        <DocumentForm
          coordinates={coordinates}
          positionProp={undefined}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      </Modal>
    </Container>
  );
};

export default Overlay;
