// ToggleButton.tsx
import React from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

interface ToggleButtonProps {
  showContent: boolean;
  onToggle: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  showContent,
  onToggle,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    onToggle();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.stopPropagation();
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <button className="ml-2" onClick={handleClick} onKeyDown={handleKeyDown}>
      {showContent ? <FaChevronDown /> : <FaChevronRight />}
    </button>
  );
};

export default ToggleButton;
