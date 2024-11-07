import { Container, Row, Col } from 'react-bootstrap';
import { ButtonRounded } from './Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { useState, useEffect, useRef } from 'react';
import LoginForm from './LoginForm';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const loginModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      height: 'auto',
    },
    overlay: { zIndex: 1000 },
  };

  const dropdownModalStyles = {
    content: {
      top: (dropdownRef.current?.getBoundingClientRect().bottom ?? 0) + 15, // Incrementa il valore per aumentare il distanziamento
      left: dropdownRef.current?.getBoundingClientRect().left,
      right: 'auto',
      bottom: 'auto',
      transform: 'translateY(0)',
      width: dropdownRef.current?.getBoundingClientRect().width, // Imposta la larghezza uguale a quella del bottone
      padding: '0',
      border: 'none',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginRight: '15px', // Aggiungi margine a destra
    },
    overlay: {
      backgroundColor: 'transparent',
      zIndex: 1000,
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);

    // Cleanup interval on component unmount
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
            style={{ with: '200px' }}
          />
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

      <Modal
        style={loginModalStyles}
        isOpen={loginModalOpen}
        onRequestClose={() => setLoginModalOpen(false)}
      >
        <LoginForm setLoginModalOpen={setLoginModalOpen} />
      </Modal>

      <Modal
        style={dropdownModalStyles}
        isOpen={dropdownOpen}
        onRequestClose={() => setDropdownOpen(false)}
        ariaHideApp={false}
      >
        <div>
          <div
            onClick={() => navigate('/')}
            style={{ padding: '10px', cursor: 'pointer' }}
          >
            Home
          </div>
          <div
            onClick={handleLogout}
            style={{ padding: '10px', cursor: 'pointer' }}
          >
            Logout
          </div>
        </div>
      </Modal>
    </Container>
  );
}
