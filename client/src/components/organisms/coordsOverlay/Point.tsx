import React, {useEffect, useRef, useState } from 'react';
import { Marker, useMap } from 'react-leaflet';
import { DivIcon, LatLng } from 'leaflet';
import Modal from 'react-modal';
import { IDocument } from '../../../utils/interfaces/document.interface';
import { MapPopup } from '../../molecules/popups/MapPopup';
import { modalStyles } from '../../../pages/KirunaMap';
import DocumentForm from '../DocumentForm';
import { DocumentIcon } from '../../molecules/documentsItems/DocumentIcon';
import { renderToString } from 'react-dom/server';
import { CoordsIconStyle } from '../../molecules/MapIconsStyles';
import { Area } from './Area';
import { KirunaMunicipalityCoordinates } from '../../../context/KirunaMunicipalityCoordinates';

interface PointProps {
  id: string;
  pointCoordinates: LatLng | LatLng[];
  name: string;
  type: string;
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  pointDocuments: IDocument[];
  allDocuments: IDocument[];
  setDocuments: (documents: IDocument[]) => void;
}

export const Point: React.FC<PointProps> = ({
  id,
  pointCoordinates,
  name,
  type,
  coordinates,
  setCoordinates,
  pointDocuments,
  allDocuments,
  setDocuments
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPointId, setSelectedPointId] = useState('');
  const markerRef = useRef<L.Marker>(null);

  let markerText: any;

  if(id != "all_municipality") {
    if(pointDocuments.length == 1) {
      markerText = <DocumentIcon type={pointDocuments[0].type} stakeholders={pointDocuments[0].stakeholders} /> ;
    }
    else {
      markerText = pointDocuments.length;
    }
  }
  else {
    markerText = "AM";
  }

  //Show area when clicking/overing a marker
  let polygonFirstLoad = true;      //This variable checks if its the first time that an area is loaded on a map. If so, it hides the area
  let popupOpen = false;
  const polygonRef = useRef<L.Polygon>(null);
  const map = useMap();

  const handlePopupOpen = () => {
    if(type == 'Polygon' || id=='all_municipality') {
      popupOpen = true;
      polygonRef.current?.addTo(map);
    }
  }

  const handlePopupClose = () => {
    if(type == 'Polygon' || id=='all_municipality') {
      popupOpen = false;
      polygonRef.current?.remove();
    }
  }

  const handleMouseOver = () => {
    if(type == 'Polygon' || id=='all_municipality') {
      polygonRef.current?.addTo(map);
    }
  }

  const handleMouseOut = () => {
    if((type == 'Polygon' || id=='all_municipality') && !popupOpen) {
      polygonRef.current?.remove();
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
    <>
      <Marker key={id} 
        position={
          type == "Point" ? 
            pointCoordinates as LatLng 
          : 
            calculateCentroid(pointCoordinates as LatLng[])
        }
        
        ref={markerRef} 
        
        icon={
          new DivIcon({
            iconSize:  id!="all_municipality" ? [45, 45] : [60, 60],
            className: "pointIcon",
            html: renderToString(
              <div style={
                CoordsIconStyle(pointDocuments, id != "all_municipality" ? true : false, id == "all_municipality")
              }>
                <span style={{transform: "rotate(45deg)"}}>
                  { markerText }
                </span>
              </div>
            ),
            iconAnchor: [10, 41]
          })
        }

        eventHandlers={{
          mouseover: handleMouseOver,
          mouseout: handleMouseOut,
          popupopen: handlePopupOpen,
          popupclose: handlePopupClose
        }}
      >
        <MapPopup
          name={name}
          message="Do you want to add a document in this coordinate?"
          markerDocuments={pointDocuments}
          onYesClick={() => {
            markerRef.current?.closePopup();
            setSelectedPointId(id);
            if (!modalOpen) setModalOpen(true);
          }}
          onCancelClick={() => {
            markerRef.current?.closePopup();
          }}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          allDocuments={allDocuments}
          setDocuments={setDocuments}
        />

        {(type=='Polygon' || id=='all_municipality') &&
          <Area
            id={id}
            areaCoordinates={id != 'all_municipality' ? pointCoordinates as LatLng[] : KirunaMunicipalityCoordinates as unknown as LatLng[]}
            areaRef={polygonRef}
          />
        }
      </Marker>

      <Modal
        style={modalStyles}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
      >
        <DocumentForm
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          documents={allDocuments}
          setDocuments={setDocuments}
          selectedCoordIdProp={selectedPointId}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      </Modal>
    </>
  );
};


function calculateCentroid(coords: LatLng[]): LatLng {
  let latSum = 0, lngSum = 0;
  const n = coords.length;

  coords.forEach((c: any) => {
    latSum += c[0];
    lngSum += c[1];
  });

  return new LatLng(latSum / n, lngSum / n);
}