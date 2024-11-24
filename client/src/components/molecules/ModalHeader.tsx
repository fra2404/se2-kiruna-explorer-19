import React from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';
import {
  TbFileDescription,
  TbCloudDataConnection,
  TbBrandGoogleMaps,
} from 'react-icons/tb';
import { MdOutlineUploadFile } from 'react-icons/md';

interface ModalHeaderProps {
  currentStep: number;
  hasErrors: (step: number) => boolean;
  scrollToStep: (step: number) => void;
  setModalOpen: (open: boolean) => void;
  selectedDocument?: any;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  currentStep,
  hasErrors,
  scrollToStep,
  setModalOpen,
  selectedDocument,
}) => {
  return (
    <div
      style={{
        position: 'sticky',
        top: '-20px',
        paddingBottom: '10px',
        paddingTop: '10px',
        left: '0',
        width: '100%',
        backgroundColor: 'white',
        zIndex: 10000,
      }}
    >
      <button
        onClick={() => setModalOpen(false)}
        className="absolute top-0 right-0 p-2 text-xl text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
      <h2 className="text-center text-2xl font-bold mt-6">
        {selectedDocument ? 'Edit document' : 'Create a new document'}
      </h2>
      <div className="flex justify-between mt-4 space-x-4">
        {[
          {
            label: 'Document Info',
            icon: <IoInformationCircleOutline color="#000" />,
          },
          {
            label: 'Description',
            icon: <TbFileDescription color="#000" />,
          },
          {
            label: 'Files',
            icon: <MdOutlineUploadFile color="#000" />,
          },
          {
            label: 'Connections',
            icon: <TbCloudDataConnection color="#000" />,
          },
          {
            label: 'Georeferencing',
            icon: <TbBrandGoogleMaps color="#000" />,
          },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center mx-2">
            <button
              onClick={() => scrollToStep(i + 1)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  scrollToStep(i + 1);
                }
              }}
              className={`p-2 rounded-full ${
                hasErrors(i + 1)
                  ? 'bg-red-500 text-white'
                  : currentStep === i + 1
                    ? 'bg-swedish-flag-yellow'
                    : 'bg-gray-300 text-gray-700'
              }`}
              tabIndex={0} // Ensure the element is focusable
            >
              {item.icon}
            </button>
            <span className="mt-1 text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModalHeader;
