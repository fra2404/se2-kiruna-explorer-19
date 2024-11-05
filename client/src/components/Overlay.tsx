import { IconButton } from '@material-tailwind/react';
import { Container, Row, Col } from 'react-bootstrap';
import { useModal } from '../context/ModalContext';
import Modal from 'react-modal';
import { modalStyles } from './Map';
import DocumentForm from './DocumentForm';
import FloatingButton from './FloatingButton';
import { useState } from 'react';
import './Overlay.css';

interface OverlayProps {
  coordinates: any; //Need to pass coordinates to the modal as parameter
}

export default function Overlay({ coordinates }: OverlayProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
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
    </>
  );
}
