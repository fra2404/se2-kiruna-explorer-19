import { createContext, ReactNode, useState } from "react";
import { IDocument } from "../utils/interfaces/document.interface";

interface SelectedDocumentContextType {
  selectedDocument: IDocument | undefined;
  setSelectedDocument: (document: IDocument) => void;
}

const SelectedDocumentContext = createContext<SelectedDocumentContextType>({} as SelectedDocumentContextType);

export const SelectedDocumentProvider: React.FC<{children: ReactNode}> = ({
  children 
}) => {
  const [selectedDocument, setSelectedDocument] = useState<IDocument | undefined>();

  return (
    <SelectedDocumentContext.Provider value={{ selectedDocument, setSelectedDocument }}>
      {children}
    </SelectedDocumentContext.Provider>
  );
};

export default SelectedDocumentContext;