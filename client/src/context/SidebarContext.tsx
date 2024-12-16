import { createContext, ReactNode, useState } from "react";
import { IDocument } from "../utils/interfaces/document.interface";

interface SidebarContextType {
  sidebarVisible: boolean;
  setSidebarVisible: (sidebarVisible: boolean) => void
  selectedDocument: IDocument | undefined;
  setSelectedDocument: (document: IDocument | undefined) => void;
}

const SidebarContext = createContext<SidebarContextType>({} as SidebarContextType);

export const SidebarProvider: React.FC<{children: ReactNode}> = ({
  children 
}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);  //Using a context for the sidebar 'cause it needs to be controlled from many different places in the web app (KirunaMap, Overlay, AllMunicipalityDocuments, Sidebar, Diagram, etc.)
  const [selectedDocument, setSelectedDocument] = useState<IDocument | undefined>();

  return (
    <SidebarContext.Provider value={{ selectedDocument, setSelectedDocument, sidebarVisible, setSidebarVisible }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarContext;