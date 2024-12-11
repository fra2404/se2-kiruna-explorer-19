import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../context/AuthContext';
import { LoginModal } from './modals/LoginModal';
import DropdownModal from '../molecules/DropdownModal';
import ButtonRounded from '../atoms/button/ButtonRounded';
import MapStyleContext from '../../context/MapStyleContext';


interface HeaderProps {
  page: string;
  headerRef?: any;
  setManageCoordsModalOpen?: (manageCoordsModalOpen: boolean) => void
}

export const Header: React.FC<HeaderProps> = ({
  page,
  headerRef,
  setManageCoordsModalOpen
}) => {
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { mapType } = useContext(MapStyleContext);

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
      ref={headerRef}
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

      <div className="flex items-center justify-between" style={{ background: "transparent" }}>
        <div className='flex items-center'>
          <ButtonRounded variant="filled" className="bg-black p-2"
            img="./src/assets/logo.png" text={dateTime}
            style={{
              width: '220px',
              minWidth: '220px',
              maxWidth: '220px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: "auto"
            }}
            onClick={() => navigate('/')}
          />
          <h1 className={mapType == "osm" || page != 'map' ? 'font-bold text-black ml-2 text-2xl' : "font-bold text-white ml-2 text-2xl"}>Kiruna eXplorer</h1>
        </div>

        <div className='flex items-center gap-4'>
          {/* Button to switch to the diagram view */}
          <ButtonRounded
            variant="filled"
            text={page == 'map' ? "Go to Diagram" : 'Go to Map'}
            className="bg-black pr-4 pl-4 d-flex align-items-center"
            onClick={() => navigate(page == 'map' ? '/diagram' : '/map')}
            style={{ pointerEvents: "auto" }}
          />
          {/* Login/logout button */}

          <div className='ml-auto' style={{ pointerEvents: "auto" }}>
            {!isLoggedIn && !user ? (
              <ButtonRounded variant="filled" text="Login"
                onClick={() => {
                  setLoginModalOpen(true);
                }} className="bg-black pr-4 pl-4"
              />
            ) : (
              <div ref={dropdownRef}>
                <ButtonRounded
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  variant="filled"
                  className="bg-black pr-4 pl-4 d-flex align-items-center"
                  text={`Welcome, ${user?.name} ${dropdownOpen ? '▲' : '▼'}`}
                />
              </div>
            )}
          </div>
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
          page={page}
        />
    </div>
  );
}
