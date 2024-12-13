import React from "react"
import { DocumentItem } from "./DocumentItem"
import { IDocument } from "../../../utils/interfaces/document.interface";

interface DocumentProps {
  markerDocuments: IDocument[];
}

export const MarkerDocumentList: React.FC<DocumentProps> = ({
  markerDocuments
}) => {
  let documentList;
  documentList = Object.entries(markerDocuments).map(([id, d]) => {
    return (
      <DocumentItem 
        key={id}
        document={d}
      />
    )
  })
  return (
    <div
      style={{
        maxHeight: "30vh",
        overflow: "auto"
      }}
    >
      {
        documentList
      }
    </div>
  )
}