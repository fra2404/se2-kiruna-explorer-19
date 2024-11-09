import React from "react"
import { IDocument } from "../../../utils/interfaces/document.interface"
import { DocumentItem } from "./DocumentItem"

interface DocumentProps {
  documents: IDocument[]
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