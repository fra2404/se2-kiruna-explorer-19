import { ButtonRounded } from './Button';
import { IconButton } from '@material-tailwind/react';
import { Container, Row, Col } from 'react-bootstrap';
import { useModal } from '../context/ModalContext';
import Modal from 'react-modal';
import { modalStyles } from './Map';
import DocumentForm from './DocumentForm';
import { useState } from 'react';

interface OverlayProps {
    coordinates: any        //Need to pass coordinates to the modal as parameter
}

export default function Overlay({coordinates}: OverlayProps) {
    const [modalOpen, setModalOpen] = useState(false);
    return (
        <Container fluid className="p-3" style={{ position: "absolute", top: "50vh", left: 0, width: "100%", zIndex: 1000 }}>
            <Row className="h-100 align-items-center justify-content-end">
                <Col className="d-flex justify-content-end">
                    <ButtonRounded variant="filled" className="bg-black text-white text-base pt-2 pb-2 pl-3 pr-3" text="+" onClick={() => {
                        if (!modalOpen) {
                            setModalOpen(true);
                        }
                    }} />
                </Col>
            </Row>

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


    )


}

