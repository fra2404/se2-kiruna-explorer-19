import { ButtonRounded } from './Button';
import { IconButton } from '@material-tailwind/react';
import { Container, Row, Col } from 'react-bootstrap';
import { useModal } from '../context/ModalContext';
import Modal from 'react-modal';
import { modalStyles } from './Map';
import DocumentForm from './DocumentForm';
import FloatingButton from './FloatingButton';

interface OverlayProps {
    coordinates: any        //Need to pass coordinates to the modal as parameter
}

export default function Overlay({ coordinates }: OverlayProps) {
    const { modalOpen, setModalOpen } = useModal();
    return (
        <>
            <Container fluid style={{ position: "absolute", top: "50vh", left: 0, width: "100%", zIndex: 1000 }}>
                <FloatingButton text="+" onClick={() => {
                    if (!modalOpen) {
                        setModalOpen(true);
                    }
                }} >
                </FloatingButton>
                <Modal
                    style={modalStyles}
                    isOpen={modalOpen}
                    onRequestClose={() => setModalOpen(false)}
                >
                    <DocumentForm
                        coordinates={coordinates}
                        modalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                    />
                </Modal>
            </Container>

        </>

    )


}

