import React from "react";
import CustomMap, { kirunaLatLngCoords } from "../../molecules/CustomMap";
import { IDocument } from "../../../utils/interfaces/document.interface";
import { MunicipalityArea } from "../../molecules/MunicipalityArea";
import { Point } from "./Point";
import { LatLng } from "leaflet";

interface AllMunicipalityDocumentsProps {
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  documents: IDocument[];
  setDocuments: (documents: IDocument[]) => void;
  filteredDocuments: IDocument[];
  setFilteredDocuments: (filteredDocuments: IDocument[]) => void;
}

export const AllMunicipalityDocuments: React.FC<AllMunicipalityDocumentsProps> = ({
  coordinates,
  setCoordinates,
  documents,
  setDocuments,
  filteredDocuments,
  setFilteredDocuments
}) => {
  
  return (
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
          setAllDocuments={setDocuments}
          filteredDocuments={filteredDocuments}
          setFilteredDocuments={setFilteredDocuments}
        />

        <MunicipalityArea />
      </CustomMap>
    </div>
  )
}