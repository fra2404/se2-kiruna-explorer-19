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

interface PointProps {
  id: string;
  pointCoordinates: LatLng | LatLng[];
  name: string;
  type: string;
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  pointDocuments: IDocument[];
  allDocuments: IDocument[];
  setAllDocuments: (documents: IDocument[]) => void;
  filteredDocuments: IDocument[];
  setFilteredDocuments: (filteredDocuments: IDocument[]) => void;
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
  setAllDocuments,
  filteredDocuments,
  setFilteredDocuments
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPointId, setSelectedPointId] = useState('');
  const markerRef = useRef<L.Marker>(null);

  let markerText: any;

  if(pointDocuments.length == 1) {
    markerText = <DocumentIcon type={pointDocuments[0].type.type} stakeholders={pointDocuments[0].stakeholders?.map((s) => s.type) } /> ;
  }
  else {
    markerText = pointDocuments.length;
  }

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
            iconSize: [45, 45],
            className: "pointIcon",
            html: renderToString(
              <div style={
                CoordsIconStyle(pointDocuments, true)
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
          click: handleClick,
          popupclose: handlePopupClose
        }}
      >
        <MapPopup
          name={name}
          message="Do you want to add a document in this coordinates?"
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
          setDocuments={setAllDocuments}
          filteredDocuments={filteredDocuments}
          setFilteredDocuments={setFilteredDocuments}
        />

        {(type=='Polygon') &&
          <Area
            id={id}
            areaCoordinates={pointCoordinates as LatLng[]}
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
          setDocuments={setAllDocuments}
          filteredDocuments={filteredDocuments}
          setFilteredDocuments={setFilteredDocuments}
          selectedCoordIdProp={id != 'all_municipality' ? selectedPointId : undefined}
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