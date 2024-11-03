import { Container, Row, Col } from 'react-bootstrap';
import { ButtonRounded } from './Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Modal from "react-modal";
import { useState } from 'react';
import LoginForm from './LoginForm';


export default function Header() {
    const dateTime = new Date().toLocaleString()
    const navigate = useNavigate();

    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const loginModalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            height: "auto"
        },
        overlay: {zIndex: 1000}
    }

    return (
        <Container fluid className="p-3" style={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 1000 }}>
            <Row className="align-items-center">
                <Col xs="auto" className="d-flex align-items-center">
                    <ButtonRounded variant="filled" className="bg-black pr-4 pl-4" img="./src/assets/logo.png" text={dateTime} />
                </Col>
                <Col className="d-flex justify-content-end">
                    <ButtonRounded onClick={() => {setLoginModalOpen(true)}} variant="filled" className="bg-black pr-4 pl-4" text="Login" />  {/* If the user is NOT logged in TODO: add the authcontext*/}
                    {/* <ButtonRounded variant="" className="bg-black rounded-full" text="Welcome, D." /> */} {/* If the user is logged in */}
                </Col>
            </Row>

            <Modal style={loginModalStyles} isOpen={loginModalOpen} onRequestClose={() => setLoginModalOpen(false)}>
                <LoginForm setLoginModalOpen={setLoginModalOpen} />
            </Modal>
        </Container>
    );

}