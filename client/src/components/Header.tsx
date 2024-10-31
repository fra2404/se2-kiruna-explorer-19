import { Container, Row, Col } from 'react-bootstrap';
import { ButtonRounded } from './Button';
import 'bootstrap/dist/css/bootstrap.min.css';



export default function Header() {
    return (
        <Container fluid className="p-3" style={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 1000 }}>
            <Row className="align-items-center">
                <Col xs="auto" className="d-flex align-items-center">
                    <img src="./src/assets/logo.png" alt="Login" style={{ width: "4rem", height: "4rem", cursor: "pointer" }} />
                    <h1 className="ms-3">Kiruna Map</h1>
                </Col>
                <Col className="d-flex justify-content-end">
                    <ButtonRounded />
                </Col>
            </Row>
        </Container>
    );

}