import React from "react"
import { IDocument } from "../../../utils/interfaces/document.interface"
import { DocumentIcon } from "./DocumentIcon"
import { FaArrowRight } from "react-icons/fa"

interface DocumentItemProps {
  document: IDocument
}

export const DocumentItem: React.FC<DocumentItemProps> = ({
  document
}) => {
  return (
    <div className="flex py-1 cursor-pointer hover:bg-gray-200 rounded-lg" onClick={() => {}}>
      <div className="flex-none size-8 ml-1 mr-3 self-center">
        <DocumentIcon type={document.type} stakeholders={document.stakeholders} />
      </div>
      <span className="flex-1 text-lg font-bold self-center mr-3" >{document.title}</span>
      <FaArrowRight className="text-lg self-center font-bold mr-1" />
    </div>
  )
}