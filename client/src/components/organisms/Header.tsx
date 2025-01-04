import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../context/AuthContext';
import { LoginModal } from './modals/LoginModal';
import DropdownModal from '../molecules/DropdownModal';
import ButtonRounded from '../atoms/button/ButtonRounded';
import { Sidebar } from './Sidebar';
import { IDocument } from '../../utils/interfaces/document.interface';
import logo from '../../assets/logo.png'

interface HeaderProps {
  page: string;
  headerRef?: any;
  setManageCoordsModalOpen?: (manageCoordsModalOpen: boolean) => void;
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  allDocuments: IDocument[];
  setAllDocuments: (allDocuments: IDocument[]) => void;
  filteredDocuments: IDocument[];
  setFilteredDocuments: (documents: IDocument[]) => void;
}

export const Header: React.FC<HeaderProps> = ({
  page,
  headerRef,
  setManageCoordsModalOpen,
  coordinates,
  setCoordinates,
  allDocuments,
  setAllDocuments,
  filteredDocuments,
  setFilteredDocuments,
}) => {
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        <ButtonRounded
          text={
            <>
              <img src={logo} alt='Logo' className='h-12 border border-black rounded-full '/>
              <h1 className={"font-bold text-white ml-2 text-3xl"}>Kiruna eXplorer</h1>
              {/* Date and time */}
              <div className="text-white rounded-full px-3 py-2 ml-4"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pointerEvents: "auto",
                  fontSize: '15px'
                }} 
              >
                {dateTime}
              </div>
            </>
          }
          variant='filled'
          style={{
            pointerEvents: 'auto'
          }}
          className='flex items-center border-none'
          onClick={() => navigate('/')}
        >
          {
            <>
              <img src={logo} alt='Logo' className='h-12 border border-black rounded-full '/>
              <h1 className={"font-bold text-white ml-2 text-3xl"}>Kiruna eXplorer</h1>
              {/* Date and time */}
              <div className="text-white rounded-full px-3 py-2 ml-4"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pointerEvents: "auto",
                  fontSize: '15px'
                }} 
              >
                {dateTime}
              </div>
            </>
          }
          </ButtonRounded>

        <div className='flex items-center gap-4'>
          {/* Button to switch the map/diagram view */}
          <ButtonRounded
            variant="filled"
            text={page == 'map' ? "Go to Diagram" : 'Go to Map'}
            className="bg-black pr-4 pl-4 d-flex align-items-center text-sm"
            onClick={() => navigate(page == 'map' ? '/diagram' : '/map')}
            style={{ pointerEvents: "auto" }}
          >
            {page == 'map' ? "Go to Diagram" : 'Go to Map'}
            </ButtonRounded>

          {/* Login/logout button */}
          <div className='ml-auto' style={{ pointerEvents: "auto" }}>
            {!isLoggedIn && !user ? (
              <ButtonRounded variant="filled" text="Login"
                onClick={() => {
                  setLoginModalOpen(true);
                }} className="bg-black pr-4 pl-4 text-sm"
              >
              Login
              </ButtonRounded>
            ) : (
              <div ref={dropdownRef}>
                <ButtonRounded
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  variant="filled"
                  className="bg-black pr-4 pl-4 d-flex align-items-center text-sm"
                  text={`Welcome, ${user?.name} ${dropdownOpen ? '▲' : '▼'}`}
                >
                {`Welcome, ${user?.name} ${dropdownOpen ? '▲' : '▼'}`}
                </ButtonRounded>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className='ml-auto' style={{ pointerEvents: "auto" }}>
            <Sidebar
              coordinates={coordinates}
              setCoordinates={setCoordinates}
              allDocuments={allDocuments}
              setAllDocuments={setAllDocuments}
              filteredDocuments={filteredDocuments}
              setFilteredDocuments={setFilteredDocuments}
              page={page}
            />
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
