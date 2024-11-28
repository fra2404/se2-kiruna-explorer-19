import React, { useState } from "react";
import CustomMap, { kirunaLatLngCoords } from "../../molecules/CustomMap";
import DocumentForm from "../DocumentForm";
import { modalStyles } from "../../../pages/KirunaMap";
import Modal from 'react-modal';
import { IDocument } from "../../../utils/interfaces/document.interface";
import { MunicipalityArea } from "../../molecules/MunicipalityArea";
import { Point } from "./Point";
import { LatLng } from "leaflet";

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
          <Point
            id='all_municipality'
            name='All Municipality'
            pointCoordinates={kirunaLatLngCoords as LatLng}
            type='Point'
            pointDocuments={documents.filter((d) => !d.coordinates)}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            allDocuments={documents}
            setDocuments={setDocuments}
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