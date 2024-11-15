import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../context/AuthContext';
import { LoginModal } from './modals/LoginModal';
import DropdownModal from '../molecules/DropdownModal';
import ButtonRounded from '../atoms/button/ButtonRounded';
import MapStyleContext from '../../context/MapStyleContext';

interface HeaderProps {
  setManageCoordsModalOpen: (manageCoordsModalOpen: boolean) => void
}

export const Header: React.FC<HeaderProps> = ({
  setManageCoordsModalOpen
}) => {
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
    <div
      className="p-3"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 10,
        background: "transparent",
        pointerEvents: "none"
      }}
    >
      <div className="align-items-center flex" style={{background: "transparent"}}>
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
            pointerEvents: "auto"
          }}
        />

        <h1 className={mapType == "osm" ? 'font-bold text-black ml-3' : "font-bold text-white ml-3"}>Kiruna eXplorer</h1>

        <div className='ml-auto' style={{pointerEvents: "auto"}}>
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
        </div>
      </div>

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
        setManageCoordsModalOpen={setManageCoordsModalOpen}
      />
    </div>
  );
}
