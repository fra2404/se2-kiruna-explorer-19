import React, { useContext } from "react";
import ButtonRounded from "../atoms/button/ButtonRounded";
import { FaArrowLeft, FaFolder } from "react-icons/fa";
import { IDocument } from "../../utils/interfaces/document.interface";
import { FaX } from "react-icons/fa6";
import AllDocumentsList from "./AllDocumentsList";
import SidebarContext from "../../context/SidebarContext";
import DocumentDetails from "./DocumentDetails";

interface SidebarProps {
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  allDocuments: IDocument[];
  setAllDocuments: (allDocuments: IDocument[]) => void;
  filteredDocuments: IDocument[];
  setFilteredDocuments: (documents: IDocument[]) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  coordinates,
  setCoordinates,
  allDocuments,
  setAllDocuments,
  filteredDocuments,
  setFilteredDocuments
}) => {
  const {selectedDocument, setSelectedDocument, sidebarVisible, setSidebarVisible} = useContext(SidebarContext);
  
  return (
    <>
      <ButtonRounded 
        text={<FaFolder />}
        variant="filled"
        className="bg-black px-3 text-base"
        onClick={() => setSidebarVisible(true)}
      />
      <nav
        style={{
          background: '#ffffff',
          height: '100vh',
          display: 'flex',
          position: 'fixed',
          top: 0,
          right: sidebarVisible ? "0" : "-100%",
          transition: '350ms',
          maxHeight: '100vh',
          overflow: 'auto'
        }}
        className='border-l xl:w-2/5 lg:w-4/6 md:w-5/6 w-full'
      >
        <div className='flex flex-col w-full'>
          <div className='flex fixed xl:w-2/5 lg:w-4/6 md:w-5/6 w-full bg-white p-2 z-10'>
            {selectedDocument &&
              <FaArrowLeft 
                className='top-2 cursor-pointer text-3xl mr-2'
                onClick={() => setSelectedDocument(undefined)}
              />
            }
            <h1 
              className='text-2xl font-bold text-left'
              style={{
                maxWidth: '90%'
              }}
            >
              {!selectedDocument ? 'All Documents' : selectedDocument.title}
            </h1>

            <FaX 
              style={{ right: sidebarVisible ? '0.5rem' : '-100%', transition: '350ms'}}  //The best way I had to still have the transition. Not so beautiful but I don't know another method to have it working
              onClick={() => {
                setSidebarVisible(false);
                setSelectedDocument(undefined);
              }}
              className='fixed top-2 cursor-pointer text-3xl'
            />
          </div>

          {
            !selectedDocument ?
            <AllDocumentsList
              filteredDocuments={filteredDocuments}
              setFilteredDocuments={setFilteredDocuments}
            />
            :
            <DocumentDetails 
              document={selectedDocument}
              coordinates={coordinates}
              setCoordinates={setCoordinates}
              allDocuments={allDocuments}
              setAllDocuments={setAllDocuments}
              filteredDocuments={filteredDocuments}
              setFilteredDocuments={setFilteredDocuments}
            />
          }
        </div>
      </nav>
    </>
  )
}