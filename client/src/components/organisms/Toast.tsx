import React, { useEffect } from 'react';
import ToastMessage from '../molecules/ToastMessage';

interface ToastProps {
  isShown: boolean;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [onClose]);

  return (
    <div
      className={`absolute bottom-0 right-0 transition-all duration-400 z-10 ${
        isShown ? 'block' : 'hidden'
      }`}
    >
      <div
        className={`min-w-52 bg-white border shadow-2xl rounded-md after:w-[5px] after:h-full ${
          type === 'error' ? 'after:bg-red-500' : 'after:bg-green-500'
        } after:absolute after:left-0 after:top-0 after:rounded-lg`}
      >
        <ToastMessage message={message} type={type} />
      </div>
    </div>
  );
};

export default Toast;
