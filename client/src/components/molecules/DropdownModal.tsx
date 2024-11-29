import React from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../context/AuthContext';
import { UserRoleEnum } from '../../utils/interfaces/user.interface';


interface DropdownModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  navigate: (path: string) => void;
  handleLogout: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
  setManageCoordsModalOpen: (manageCoordsModalOpen: boolean) => void
}

const DropdownModal: React.FC<DropdownModalProps> = ({
  isOpen,
  onRequestClose,
  navigate,
  handleLogout,
  dropdownRef,
  setManageCoordsModalOpen
}) => {
  const dropdownModalStyles = {
    content: {
      top: (dropdownRef.current?.getBoundingClientRect().bottom ?? 0) + 15,
      left: dropdownRef.current?.getBoundingClientRect().left,
      right: 'auto',
      bottom: 'auto',
      transform: 'translateY(0)',
      width: dropdownRef.current?.getBoundingClientRect().width,
      padding: '0',
      border: 'none',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginRight: '15px',
    },
    overlay: {
      backgroundColor: 'transparent',
      zIndex: 1000,
    },
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onRequestClose();
  };

  const handleLogoutClick = () => {
    handleLogout();
    onRequestClose();
  };

  const { isLoggedIn, user } = useAuth();

  return (
    <Modal
      style={dropdownModalStyles}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
    >
      <div>
        <div
          onClick={() => handleNavigate('/')}
          className='p-2.5 cursor-pointer hover:bg-gray-200 rounded-lg'
        >
          Home
        </div>

        {
          (isLoggedIn && user && user.role === UserRoleEnum.Uplanner) && (
            <div
              onClick={() => setManageCoordsModalOpen(true)}
          className='p-2.5 cursor-pointer hover:bg-gray-200 rounded-lg'
            >
              Manage points&areas
            </div>
          )
        }

        <div
          onClick={handleLogoutClick}
          className='p-2.5 cursor-pointer hover:bg-gray-200 rounded-lg'
        >
          Logout
        </div>
      </div>
    </Modal>
  );
};

export default DropdownModal;
