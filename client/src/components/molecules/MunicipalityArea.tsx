import React, { useContext, useRef } from "react";
import MunicipalityCoordinatesContext from "../../context/MunicipalityCoordinatesContext";
import { Area } from "../organisms/coordsOverlay/Area";
import { LatLng } from "leaflet";
import { Polyline } from "react-leaflet";
import MapStyleContext from "../../context/MapStyleContext";

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

export const MunicipalityAreaOutline: React.FC = () => {
  const {municipalityCoordinates} = useContext(MunicipalityCoordinatesContext);
  const { swedishFlagBlue, satMapMainColor, mapType } = useContext(MapStyleContext);
  
  const convertedMunicipality = convertToLatLngArray(municipalityCoordinates);

  const municipalityOutline = Object.entries(convertedMunicipality).map(([n, c]) => {
    return (
      <Polyline
        key={n}
        positions={c}
        pathOptions={{color: mapType == 'sat' ? satMapMainColor : swedishFlagBlue}}
      />
    )
  })

  return municipalityOutline;
}

function convertToLatLngArray(input: number[][][]): LatLng[][] {
  return input.map((layer) => 
    layer.map((coordinatePair) => 
      new LatLng(coordinatePair[1], coordinatePair[0])    //I invert lat and lng, since in the GeoJSON they are in format [lng, lat]
    )
  );
}