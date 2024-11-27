import React, { useContext, useRef } from "react";
import MunicipalityCoordinatesContext from "../../context/MunicipalityCoordinatesContext";
import { Area } from "../organisms/coordsOverlay/Area";
import { LatLng } from "leaflet";

export const MunicipalityArea: React.FC = () => {
  const {municipalityCoordinates} = useContext(MunicipalityCoordinatesContext);
  const areaRef = useRef<L.Polygon>(null);

  const convertedMunicipality = convertToLatLngArray(municipalityCoordinates);

  const municipalityArea = Object.entries(convertedMunicipality).map(([n, c]) => {
    return (
      <Area 
        key={n}
        id="Kiruna Municipaity"
        areaCoordinates={c}
        areaRef={areaRef}
      />
    )
  })

  return municipalityArea;
}

function convertToLatLngArray(input: number[][][]): LatLng[][] {
  return input.map((layer) => 
    layer.map((coordinatePair) => 
      new LatLng(coordinatePair[1], coordinatePair[0])
    )
  );
}