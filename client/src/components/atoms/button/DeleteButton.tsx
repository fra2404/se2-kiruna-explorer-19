import React from 'react';
import { FaTrash } from 'react-icons/fa';

interface DeleteButtonProps {
  onClick: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  return (
    <button className="text-red-500 hover:text-red-700" onClick={onClick}>
      <FaTrash />
    </button>
  );
};
