import React from 'react';
import Modal from 'react-modal';
import LoginForm from '../molecules/LoginForm';

interface LoginModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  setLoginModalOpen: (open: boolean) => void;
}

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

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onRequestClose,
  setLoginModalOpen,
}) => {
  return (
    <Modal
      style={loginModalStyles}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <LoginForm setLoginModalOpen={setLoginModalOpen} />
    </Modal>
  );
};
