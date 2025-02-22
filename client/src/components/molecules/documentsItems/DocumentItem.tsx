import React, { useContext } from 'react';
import { DocumentIcon } from './DocumentIcon';
import { FaArrowRight } from 'react-icons/fa';
import Modal from 'react-modal';
import { IDocument } from '../../../utils/interfaces/document.interface';
import SidebarContext from '../../../context/SidebarContext';

Modal.setAppElement('#root');

interface DocumentItemProps {
  document: IDocument;
}

export const DocumentItem: React.FC<DocumentItemProps> = ({ document }) => {
  const { selectedDocument, setSelectedDocument, setSidebarVisible } =
    useContext(SidebarContext);

  return (
    <button
      className={
        selectedDocument?.id == document.id
          ? 'flex py-1 hover:bg-gray-200 rounded-lg text-start w-full bg-gray-200'
          : 'flex py-1 hover:bg-gray-200 rounded-lg text-start w-full'
      }
      onClick={() => {
        setSelectedDocument(document);
        setSidebarVisible(true);
      }}
    >
      <div className="flex-none size-8 ml-1 mr-3 self-center">
        <DocumentIcon
          type={document.type.type}
          stakeholders={
            document.stakeholders?.map((s) => ({ _id: s._id, type: s.type })) ||
            []
          }
        />
      </div>
      <span className="flex-1 text-lg font-bold self-center mr-3">
        {document.title}
      </span>
      <FaArrowRight className="text-lg self-center font-bold mr-1" />
    </button>
  );
};
