import { useEffect, useState, useContext } from "react";
import { useMap, FeatureGroup, Popup } from "react-leaflet";
import L, { LatLng } from "leaflet";

import { PiPolygonFill } from "react-icons/pi";
import { createCoordinate } from "../../API"
import MapStyleContext from "../../context/MapStyleContext";
import InputComponent from "../atoms/input/input";
import ButtonRounded from "../atoms/button/ButtonRounded";
import { ICoordinate } from "../../utils/interfaces/document.interface";
import useToast from "../../utils/hooks/toast";
import Toast from "../organisms/Toast";

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import FloatingButton from "./FloatingButton";
import { isMarkerInsideKiruna } from "../../utils/isMarkerInsideKiruna";

interface DrawingPanelProps {
    coordinates: any;
    setCoordinates: (coordinates: any) => void;
    setSelectedCoordId?: (value: string) => void;
    setPosition: (position: LatLng | undefined) => void;
    setCoordName: (name: string) => void;
    popupRef: React.MutableRefObject<any>;
    featureGroupRef: React.MutableRefObject<any>;
}

const DrawingPanel: React.FC<DrawingPanelProps> = ({
    coordinates,
    setCoordinates,
    setSelectedCoordId,
    setPosition,
    setCoordName,
    popupRef,
    featureGroupRef
}) => {
    const map = useMap();
    const [areaName, setAreaName] = useState('');
    const [newAreaCoordinates, setNewAreaCoordinates] = useState([]);
    const [popupPosition, setPopupPosition] = useState(null);
    const { swedishFlagBlue, satMapMainColor, mapType } = useContext(MapStyleContext);

    const [isHoveredAddArea, setIsHoveredAddArea] = useState(false);
    const { toast, showToast, hideToast } = useToast();

    useEffect(() => {
        if (!featureGroupRef.current) return;
        const drawnItems = featureGroupRef.current;
        map.addLayer(drawnItems);

        map.on("draw:created", (e: any) => {
            const layer = e.layer;
            drawnItems.addLayer(layer);
            const areaCoordinates = layer.getLatLngs().flatMap((latlng : any) =>
             	Array.isArray(latlng) ? latlng.map((ll : any) => [ll.lat, ll.lng]) 
                                      : [[latlng.lat, latlng.lng]]);
            setPopupPosition(layer.getBounds().getCenter());
            setNewAreaCoordinates(areaCoordinates);
        });

        return () => {
            map.off("draw:created");
        }
    }, [map]);

    const handleDrawPolygon = () => {
        const drawControl = new L.Draw.Polygon(map as unknown as L.DrawMap, {
            allowIntersection: false,
            shapeOptions: { color: mapType == "sat" ? satMapMainColor : swedishFlagBlue },
        });
        drawControl.enable(); 
    };

    const handleAddArea = async () => {
        // Save the coordinates to the database
        if (!areaName) return;
        const res = await createCoordinate({
            type: 'Polygon',
            coordinates: newAreaCoordinates,
            name: areaName
        } as ICoordinate);
        if (!res.success) {
            console.log(res.coordinate?.message);
            showToast("Could not create the coordinates", 'error');
            return;
        }
        const coordId = res.coordinate?.coordinate._id;
        if (coordId) {
            setCoordinates({
                ...coordinates,
                [coordId]: {
                    type: res.coordinate?.coordinate.type,
                    coordinates: res.coordinate?.coordinate.coordinates,
                    name: res.coordinate?.coordinate.name,
                }
            });
            if(setSelectedCoordId) {
                setSelectedCoordId(coordId);
            }
            showToast("Point/Area successfully created", 'success');
        }

        featureGroupRef.current.remove();
        setPopupPosition(null);
        setAreaName('');
    };

    return (
        <>
            <FeatureGroup ref={featureGroupRef}>
                <div
                    style={{
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <FloatingButton
                        text={
                            isHoveredAddArea ? (
                                '+ Draw Area'
                            ) : (
                                <PiPolygonFill style={{ display: 'inline' }} />
                            )
                        }
                        onMouseEnter={() => setIsHoveredAddArea(true)}
                        onMouseLeave={() => setIsHoveredAddArea(false)}
                        onClick={() => {
                            setPosition(undefined);
                            if(setSelectedCoordId) {
                                setSelectedCoordId('');
                            }
                            setCoordName('');
                            handleDrawPolygon();
                        }}
                        className="floating-button-left"
                    />
                </div>
            </FeatureGroup>

            {
                popupPosition &&
                <Popup 
                    ref={popupRef} 
                    position={popupPosition}
                    eventHandlers={{
                        remove: () => {
                            featureGroupRef.current.remove()
                        }
                    }}
                >
                    {
                        validateArea(newAreaCoordinates) ?
                        <>
                            <InputComponent label="Enter the name of the new area"
                                type="text" value={areaName} onChange={(v) => {
                                    if ('target' in v) {
                                        setAreaName(v.target.value);
                                    }
                                }} 
                                required={true} 
                            />

                            <div className="flex justify-between">
                                <ButtonRounded
                                    variant="filled"
                                    text="Confirm"
                                    className="bg-black text-white text-xs pt-2 pb-2 pl-3 pr-3"
                                    onClick={handleAddArea}
                                >Confirm
                                </ButtonRounded>
                                <ButtonRounded
                                    variant="outlined"
                                    text="Cancel"
                                    className="text-xs pt-2 pb-2 pl-3 pr-3"
                                    onClick={() => {
                                        setPopupPosition(null);
                                        setAreaName('');
                                        featureGroupRef.current.remove();
                                        popupRef.current?.remove();
                                    }}
                                >Cancel
                                </ButtonRounded>
                            </div>
                        </>
                        :
                        <>
                            <span className='text-red-500 text-base'>
                                Error: area is outside of Kiruna Borders
                            </span>
                            <br /><br />
                            <ButtonRounded
                                variant="outlined"
                                text="Cancel"
                                className="text-base pt-2 pb-2 pl-3 pr-3"
                                onClick={() => {
                                    setPopupPosition(null);
                                    featureGroupRef.current.remove();
                                    popupRef.current?.remove();
                                }}
                            >
                                Cancel
                                </ButtonRounded>
                        </>
                    }
                </Popup>
            }

            {
                toast.isShown && (
                    <Toast isShown={toast.isShown} message={toast.message} 
                        type={toast.type} onClose={hideToast}
                    />
                )
            }
        </>
    );
}

export default DrawingPanel;

function validateArea(areaCoordinates: number[][]) {
    let valid = false;
    
    for (let p of areaCoordinates) {
        valid = isMarkerInsideKiruna({lat: p[0], lng: p[1]} as LatLng);
        if(!valid)
            return false;
    }

    return valid;
}