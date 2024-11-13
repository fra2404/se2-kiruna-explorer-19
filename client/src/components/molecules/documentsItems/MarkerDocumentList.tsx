import React from "react"
import { DocumentItem } from "./DocumentItem"
import { IDocumentResponse } from "../../../utils/interfaces/document.interface";

interface DocumentProps {
  documents: IDocumentResponse[]
}

export const MarkerDocumentList: React.FC<DocumentProps> = ({
  documents
}) => {
  let documentList;
  documentList = Object.entries(documents).map(([id, d]) => {
    return (
      <DocumentItem document={d} key={id} />
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