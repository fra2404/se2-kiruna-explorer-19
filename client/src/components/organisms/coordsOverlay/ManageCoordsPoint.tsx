import { Marker, Polygon, useMap } from "react-leaflet";
import { calculateCentroid } from "./Point";
import { LatLng } from "leaflet";
import { useContext, useEffect, useRef } from "react";
import { DeleteCoordPopup } from "../../molecules/popups/DeleteCoordPopup";
import { IDocument } from "../../../utils/interfaces/document.interface";
import MapStyleContext from "../../../context/MapStyleContext";
import API from "../../../API";

interface ManageCoordsPointProps {
  id: string;
  pointCoordinates: LatLng | LatLng[];
  name: string;
  type: string;
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  filteredDocuments: IDocument[];
}

export const ManageCoordsPoint: React.FC<ManageCoordsPointProps> = ({
  id,
  pointCoordinates,
  name,
  type,
  filteredDocuments,
  coordinates,
  setCoordinates
}) => {
  const markerRef = useRef<L.Marker>(null);

  const {swedishFlagBlue, satMapMainColor, mapType} = useContext(MapStyleContext);

  //Show area when clicking/overing a marker
  let polygonFirstLoad = true;      //This variable checks if its the first time that an area is loaded on a map. If so, it hides the area
  let popupOpen = false;
  const polygonRef = useRef<L.Polygon>(null);
  const map = useMap();

  const handleClick = () => {
    if(!popupOpen) {
      popupOpen = true;
      markerRef.current?.openPopup();
      if(type == 'Polygon') {
        polygonRef.current?.addTo(map);
      }
    }
  }

  const handlePopupClose = () => {
    popupOpen = false;
    if(type == 'Polygon') {
      polygonRef.current?.remove();
    }
  }

  const handleMouseOver = () => {
    markerRef.current?.openPopup();
    if(type == 'Polygon') {
      polygonRef.current?.addTo(map);
    }
  }

  const handleMouseOut = () => {
    if(!popupOpen) {
      markerRef.current?.closePopup();
      if((type == 'Polygon')) {
        polygonRef.current?.remove();
      }
    }
  }

  useEffect(() => {
    polygonRef.current?.addEventListener("add", () => {
      if(polygonFirstLoad) {
        polygonRef.current?.remove();
        polygonFirstLoad = false;
      }
    })
  }, [polygonRef.current])

  return (
    <Marker
      key={id}
      position={ type == 'Point' ? pointCoordinates as LatLng : calculateCentroid(pointCoordinates as LatLng[]) }
      ref={markerRef}

      eventHandlers={{
        mouseover: handleMouseOver,
        mouseout: handleMouseOut,
        click: handleClick,
        popupclose: handlePopupClose
      }}
    >
      <DeleteCoordPopup 
        name={name}
        message={
          filteredDocuments.length == 0 ?
            "Do you want to delete this point/area?"
          : "There are documents associated to this point/area, you cannot delete it"
        }
        showButtons={filteredDocuments.length == 0}
        onYesClick={async () => await onYesClick(markerRef, id, coordinates, setCoordinates)}
        onCancelClick={() => {
          markerRef.current?.closePopup();
        }}
      />

      {(type=='Polygon') &&
        <Polygon
          key={id}
          pathOptions={{ color: mapType == "sat" ? satMapMainColor : swedishFlagBlue }}
          positions={ pointCoordinates as LatLng[] }
          ref={polygonRef}
        />
      }
    </Marker>
  );
};

async function onYesClick(
  ref: any,
  coordToDelete: string,
  coordinates: any,
  setCoordinates: (coordinates: any) => void
) {
  ref.current?.closePopup();
  const response = await API.deleteCoordinate(coordToDelete);
  if(response.success) {
    const {[coordToDelete]: _, ...coordinatesUpdated} = coordinates;
    console.log(coordinatesUpdated);
    setCoordinates(coordinatesUpdated);
  }
}