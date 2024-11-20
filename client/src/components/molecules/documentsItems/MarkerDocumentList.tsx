import React from "react"
import { DocumentItem } from "./DocumentItem"
import { IDocument } from "../../../utils/interfaces/document.interface";

interface DocumentProps {
  markerDocuments: IDocument[];
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  allDocuments: IDocument[];
  setDocuments: (documents: IDocument[]) => void;
}

export const MarkerDocumentList: React.FC<DocumentProps> = ({
  markerDocuments,
  coordinates,
  setCoordinates,
  allDocuments,
  setDocuments
}) => {
  let documentList;
  documentList = Object.entries(markerDocuments).map(([id, d]) => {
    return (
      <DocumentItem 
        key={id}
        document={d} 
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        allDocuments={allDocuments}
        setDocuments={setDocuments}
      />
    )
  })
  return (
    <>
      {
        documentList
      }
    </>
  )
}