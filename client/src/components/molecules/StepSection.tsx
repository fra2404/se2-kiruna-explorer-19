// StepSection.tsx
import React, { ReactNode } from 'react';
import LightDivider from '../atoms/light-divider/light-divider';
import ToggleButton from '../atoms/ToggleButton';

interface StepSectionProps {
  title: string;
  children: ReactNode;
  showContent: boolean;
  toggleContent: () => void;
  hasErrors: boolean;
  ref: React.RefObject<HTMLDivElement>;
  showToggle?: boolean; // Optional prop to show the toggle button
}

const StepSection: React.FC<StepSectionProps> = ({
  title,
  children,
  showContent,
  toggleContent,
  hasErrors,
  ref,
  showToggle = true, // Default to true if not provided
}) => {
  return (
    <>
      <div
        onClick={showToggle ? toggleContent : undefined}
        onKeyDown={
          showToggle
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleContent();
                }
              }
            : undefined
        }
        tabIndex={showToggle ? 0 : -1} // Ensure the element is focusable only if toggle is enabled
        ref={ref}
        className={`header-section ${hasErrors ? 'error' : ''} scroll-margin-top`}
      >
        <h3 className="header-text text-xl font-bold mb-2">
          {title}
          {showToggle && <ToggleButton showContent={showContent} />}
        </h3>
        {(showToggle && showContent) || !showToggle ? children : null}
      </div>
      <LightDivider />
    </>
  );
};

export default StepSection;
