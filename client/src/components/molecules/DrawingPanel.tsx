import { useEffect, useRef, useState, useContext } from "react";
import { useMap, FeatureGroup, Popup } from "react-leaflet";
import L from "leaflet";

import { PiPolygonFill } from "react-icons/pi";
import API from "../../API"
import MapStyleContext from "../../context/MapStyleContext";
import InputComponent from "../atoms/input/input";
import ButtonRounded from "../atoms/button/ButtonRounded";
import { ICoordinate } from "../../utils/interfaces/document.interface";

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

const DrawingPanel = () => {
	const map = useMap();
	const featureGroupRef = useRef<any>(null);
	const [areaName, setAreaName] = useState('');
	const [coordinates, setCoordinates] = useState([]);
	const [popupPosition, setPopupPosition] = useState(null);
	const { swedishFlagBlue } = useContext(MapStyleContext);

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
			setCoordinates(areaCoordinates);
		});

		return () => {
			map.off("draw:created");
		}
	}, [map]);

	const handleDrawPolygon = () => {
		const drawControl = new L.Draw.Polygon(map, {
			allowIntersection: false,
			shapeOptions: { color: swedishFlagBlue },
		});
		drawControl.enable(); 
	};
	
	const handleDeleteShapes = () => {
		const deleteControl = new L.EditToolbar.Delete(map, {
		  featureGroup: featureGroupRef.current,
		});
		deleteControl.enable(); 
	};

	const handleAddArea = async () => {
		// Save the coordinates to the database
		console.log('coordinates', coordinates);
		const res = await API.addArea({
			type: 'Polygon',
			coordinates: coordinates,
			name: areaName
		} as ICoordinate);
		if (res.error) console.log(res.message);
		setPopupPosition(null);
		setAreaName('');
	};

    return (
		<>
			<FeatureGroup ref={featureGroupRef}>
				<div className='absolute leaflet-top leaflet-left flex flex-col items-center justify-between gap-4 z-50 mt-96 ml-4'
					style={{ pointerEvents: 'auto' }}>
					<PiPolygonFill onClick={handleDrawPolygon} size={55}
						className='my-2 bg-black text-white font-semibold p-3 rounded-full' 
					/>
				</div>
			</FeatureGroup>

			{
				popupPosition &&
				<Popup position={popupPosition} onClose={() => {}}>
						<InputComponent label="Enter area name"
							type="text" value={areaName} onChange={(v) => {
								if ('target' in v) {
								  setAreaName(v.target.value);
								}
							}} 
							required={true} 
						/>

						<ButtonRounded text='Save' variant={undefined}
							className='bg-black text-white font-semibold'
							onClick={handleAddArea} 
						/>
				</Popup>
			}
		</>
    );
}

export default DrawingPanel;