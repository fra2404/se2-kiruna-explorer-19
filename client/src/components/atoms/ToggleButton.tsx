// ToggleButton.tsx
import React from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

interface ToggleButtonProps {
  showContent: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ showContent }) => {
  return (
    <button className="ml-2">
      {showContent ? <FaChevronDown /> : <FaChevronRight />}
    </button>
  );
};

export default ToggleButton;
