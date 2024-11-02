import { Container, Row, Col } from 'react-bootstrap';
import { ButtonRounded } from './Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';


export default function Header() {
    const dateTime = new Date().toLocaleString()
    const navigate = useNavigate();

    return (
        <Container fluid className="p-3" style={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 1000 }}>
            <Row className="align-items-center">
                <Col xs="auto" className="d-flex align-items-center">
                    <ButtonRounded variant="filled" className="bg-black" img="./src/assets/logo.png" text={dateTime} />
                </Col>
                <Col className="d-flex justify-content-end">
                    <ButtonRounded onClick={() => {navigate('/login')}} variant="filled" className="bg-black" text="Login" />  {/* If the user is NOT logged in TODO: add the authcontext*/}
                    {/* <ButtonRounded variant="" className="bg-black rounded-full" text="Welcome, D." /> */} {/* If the user is logged in */}
                </Col>
            </Row>
        </Container>
    );

}