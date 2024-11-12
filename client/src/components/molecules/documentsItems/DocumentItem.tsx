import React, { useState } from "react"
import { DocumentIcon } from "./DocumentIcon"
import { FaArrowRight } from "react-icons/fa"
import Modal from "react-modal";
import DocumentDetailsModal from "../../organisms/DocumentDetailsModal";
import { IDocumentResponse } from "../../../../../server/src/interfaces/document.return.interface"

Modal.setAppElement("#root");

interface DocumentItemProps {
  document: IDocumentResponse
}

export const DocumentItem: React.FC<DocumentItemProps> = ({
  document
}) => {

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      margin: '0 auto',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      
    },
    overlay: { zIndex: 1000 },
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex py-1 cursor-pointer hover:bg-gray-200 rounded-lg" onClick={() => {setShowModal(true)}}>
        <div className="flex-none size-8 ml-1 mr-3 self-center">
          <DocumentIcon type={document.type} />
        </div>
        <span className="flex-1 text-lg font-bold self-center mr-3" >{document.title}</span>
        <FaArrowRight className="text-lg self-center font-bold mr-1" />
      </div>

      <Modal style={modalStyles} isOpen={showModal} onRequestClose={() => setShowModal(false)} >
        <DocumentDetailsModal document={document} />
      </Modal>
    </>
  )
}