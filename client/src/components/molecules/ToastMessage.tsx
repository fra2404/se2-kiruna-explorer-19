import React from 'react';
import IconWrapper from '../atoms/IconWrapper';

interface ToastMessageProps {
  message: string;
  type: 'success' | 'error';
}

const ToastMessage: React.FC<ToastMessageProps> = ({ message, type }) => {
  return (
    <div className="flex items-center gap-3 py-2 px-4">
      <IconWrapper type={type} />
      <p className="text-sm text-slate-800">{message}</p>
    </div>
  );
};

export default ToastMessage;
