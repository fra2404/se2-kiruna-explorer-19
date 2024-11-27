import React, { useState } from "react";
import CustomMap from "../../molecules/CustomMap";
import { MapPopup } from "../../molecules/popups/MapPopup";
import DocumentForm from "../DocumentForm";
import { modalStyles } from "../../../pages/KirunaMap";
import Modal from 'react-modal';
import { IDocument } from "../../../utils/interfaces/document.interface";
import { MunicipalityArea } from "../../molecules/MunicipalityArea";

interface AllMunicipalityDocumentsProps {
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  documents: IDocument[];
  setDocuments: (documents: IDocument[]) => void;
}

export const AllMunicipalityDocuments: React.FC<AllMunicipalityDocumentsProps> = ({
  coordinates,
  setCoordinates,
  documents,
  setDocuments
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  
  return (
    <>
      <div className="w-full rounded shadow-md border h-full">
        <CustomMap allMunicipality={true}>
          <MapPopup 
            name="All Municipality"
            message="Do you want to add a document associated with all municipality?"
            markerDocuments={documents.filter((d) => !d.coordinates)}
            onYesClick={() => {if (!modalOpen) setModalOpen(true);}}
            onCancelClick={() => {}}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            allDocuments={documents}
            setDocuments={setDocuments}
            allMunicipality={true}
          />

          <MunicipalityArea />
        </CustomMap>
      </div>

      <Modal
        style={modalStyles}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
      >
        <DocumentForm
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          documents={documents}
          setDocuments={setDocuments}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      </Modal>
    </>
  )
}