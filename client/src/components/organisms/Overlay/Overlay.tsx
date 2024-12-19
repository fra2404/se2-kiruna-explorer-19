import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import FloatingButton from '../../molecules/FloatingButton';
import DocumentForm from '../DocumentForm';
import { IDocument } from '../../../utils/interfaces/document.interface';
import { FaGlobe, FaPlus } from 'react-icons/fa';
import { AllMunicipalityDocuments } from '../coordsOverlay/AllMunicipalityDocuments';
import { useAuth } from '../../../context/AuthContext';
import { UserRoleEnum } from '../../../utils/interfaces/user.interface';
import './Overlay.css';
import SidebarContext from '../../../context/SidebarContext';

interface OverlayProps {
  coordinates: any; //Need to pass coordinates to the modal as parameter
  setCoordinates: (coordinates: any) => void;
  documents: IDocument[];
  setDocuments: (documents: IDocument[]) => void;
  filteredDocuments: IDocument[];
  setFilteredDocuments: (filteredDocuments: IDocument[]) => void;
}

const Overlay: React.FC<OverlayProps> = ({
  coordinates,
  setCoordinates,
  documents,
  setDocuments,
  filteredDocuments,
  setFilteredDocuments
}) => {
  const [isHoveredMunicipality, setIsHoveredMunicipality] = useState(false);
  const [showMunicipalityDocuments, setShowMunicipalityDocuments] =
    useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [isHoveredNewDocument, setIsHoveredNewDocument] = useState(false);

  const { isLoggedIn, user } = useAuth();

  const {sidebarVisible} = useContext(SidebarContext);

  const municipalityDocumentsModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      height: '90vh',
    },
    overlay: { zIndex: 1000 },
  };

  return (
    <div style={{
        position: 'absolute',
        top: '50vh',
        left: 0,
        width: '100%',
        transform: '350ms',
        zIndex: 1000,
      }}
    >
      <FloatingButton
        text={
          isHoveredMunicipality ? (
            'All Municipality Documents'
          ) : (
            <FaGlobe style={{ display: 'inline' }} />
          )
        }
        onMouseEnter={() => setIsHoveredMunicipality(true)}
        onMouseLeave={() => setIsHoveredMunicipality(false)}
        onClick={() => {
          if (!modalOpen) {
            setShowMunicipalityDocuments(true);
          }
        }}
        className={sidebarVisible ? 'floating-button-right mr-button' : 'floating-button-right'}
      />

      {isLoggedIn && user && user.role === UserRoleEnum.Uplanner && (
        <FloatingButton
          text={
            isHoveredNewDocument ? (
              '+ New Document'
            ) : (
              <FaPlus style={{ display: 'inline' }} />
            )
          }
          onMouseEnter={() => setIsHoveredNewDocument(true)}
          onMouseLeave={() => setIsHoveredNewDocument(false)}
          onClick={() => {
            if (!modalOpen) {
              setModalOpen(true);
            }
          }}
          className={sidebarVisible ? 'floating-button-right mt-20 mr-button' : 'floating-button-right mt-20'}
        />
      )}

      <DocumentForm
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        positionProp={undefined}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        documents={documents}
        setDocuments={setDocuments}
        filteredDocuments={filteredDocuments}
        setFilteredDocuments={setFilteredDocuments}
      />

      <Modal
        style={municipalityDocumentsModalStyles}
        isOpen={showMunicipalityDocuments}
        onRequestClose={() => setShowMunicipalityDocuments(false)}
      >
        <AllMunicipalityDocuments
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          documents={documents}
          setDocuments={setDocuments} 
          filteredDocuments={filteredDocuments}
          setFilteredDocuments={setFilteredDocuments}
        />
      </Modal>
    </div>
  );
};

export default Overlay;