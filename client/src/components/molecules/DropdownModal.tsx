import React from 'react';
import Modal from 'react-modal';

interface DropdownModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  navigate: (path: string) => void;
  handleLogout: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

const DropdownModal: React.FC<DropdownModalProps> = ({
  isOpen,
  onRequestClose,
  navigate,
  handleLogout,
  dropdownRef,
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
          style={{ padding: '10px', cursor: 'pointer' }}
        >
          Home
        </div>
        <div
          onClick={handleLogoutClick}
          style={{ padding: '10px', cursor: 'pointer' }}
        >
          Logout
        </div>
      </div>
    </Modal>
  );
};

export default DropdownModal;
