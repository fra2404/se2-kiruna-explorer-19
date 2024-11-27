import React, { useContext, useState } from "react";
import CustomMap from "../../molecules/CustomMap";
import { MapPopup } from "../../molecules/popups/MapPopup";
import DocumentForm from "../DocumentForm";
import { modalStyles } from "../../../pages/KirunaMap";
import Modal from 'react-modal';
import { IDocument } from "../../../utils/interfaces/document.interface";
import { MunicipalityArea } from "../../molecules/MunicipalityArea";
import { TileLayer } from "react-leaflet";
import MapStyleContext from "../../../context/MapStyleContext";
import CustomZoomControl from "../../molecules/ZoomControl";

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
  const {mapType} = useContext(MapStyleContext);
  
  return (
    <>
      <div className="w-full rounded shadow-md border h-full">
        <CustomMap allMunicipality={true}>
          {mapType === 'osm' ? (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : (
            <TileLayer
              attribution='ArcGIS'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}
          <CustomZoomControl />

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