import { useState, useEffect, useRef, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../context/AuthContext';
import { LoginModal } from './LoginModal';
import DropdownModal from '../molecules/DropdownModal';
import ButtonRounded from '../atoms/button/ButtonRounded';
import MapStyleContext from '../../context/MapStyleContext';

export default function Header() {
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {mapType} = useContext(MapStyleContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Container
      fluid
      className="p-3"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
      }}
    >
      <Row className="align-items-center">
        <Col xs="auto" className="d-flex align-items-center">
          <ButtonRounded
            variant="filled"
            className="bg-black pr-4 pl-4"
            img="./src/assets/logo.png"
            text={dateTime}
            style={{
              width: '220px',
              minWidth: '220px',
              maxWidth: '220px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </Col>
        <Col className="d-flex align-items-center">
            <h1  className={mapType == "osm" ? 'font-bold text-black' : "font-bold text-white"}>Kiruna eXplorer</h1>
        </Col>
        <Col className="d-flex justify-content-end">
          {!isLoggedIn && !user ? (
            <ButtonRounded
              onClick={() => {
                setLoginModalOpen(true);
              }}
              variant="filled"
              className="bg-black pr-4 pl-4"
              text="Login"
            />
          ) : (
            <div ref={dropdownRef}>
              <ButtonRounded
                onClick={() => setDropdownOpen(!dropdownOpen)}
                variant="filled"
                className="bg-black pr-4 pl-4 d-flex align-items-center"
                text={`Welcome, ${user?.name.charAt(0).toUpperCase()} ${dropdownOpen ? '▲' : '▼'}`}
              />
            </div>
          )}
        </Col>
      </Row>

      <LoginModal
        isOpen={loginModalOpen}
        onRequestClose={() => setLoginModalOpen(false)}
        setLoginModalOpen={setLoginModalOpen}
      />

      <DropdownModal
        isOpen={dropdownOpen}
        onRequestClose={() => setDropdownOpen(false)}
        navigate={navigate}
        handleLogout={handleLogout}
        dropdownRef={dropdownRef}
      />
    </Container>
  );
}
