import { useEffect, useRef, useState, useContext } from "react";
import { useMap, FeatureGroup, Popup } from "react-leaflet";
import L from "leaflet";

import { MdDelete } from "react-icons/md";
import { PiPolygonFill } from "react-icons/pi";
import API from "../../API"
import MapStyleContext from "../../context/MapStyleContext";
import InputComponent from "../atoms/input/input";
import ButtonRounded from "../atoms/button/ButtonRounded";
// import Toast from "../organisms/Toast";

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { ICoordinate } from "../../utils/interfaces/document.interface";

// <Toast isShown={toast.isShown} message={toast.message}
// 		type={toast.type} onClose={() => {
// 		console.log('closing toast');
// 		setToast({ ...toast, isShown: false })
// 	}} 
// />
// <MdEdit onClick={handleEditShapes} size={36}
// className='my-2 bg-black text-white font-semibold p-2 rounded-full' 
// />
// Editing handlers
// const handleEditShapes = () => {
// 	const editControl = new L.EditToolbar.Edit(map, {
// 	  featureGroup: featureGroupRef.current,
// 	});
// 	editControl.enable(); 
// };
// const [tooltip, setTooltip] = useState({ text: "", position: null });
// const hideTooltip = () => setTooltip({ text: "", position: null });
// const showTooltip = (text : any, event : any) => {
// 	const { top, left } = event.target.getBoundingClientRect();
// 	setTooltip({
// 	  text,
// 	  position: { top: top - 10, left: left + 40 }, // Position tooltip relative to button
// 	});
// };
// { ref, onCreated} : {ref: any, onCreated: any}
// <EditControl position='topright' onCreated={onCreated}
//                 draw={{
//                     rectangle: false,
//                     circle: false,
//                     circlemarker: false,
//                     marker: false,
//                     polyline: true,
//                     polygon: true,
//                 }} />
// <PiPolygonFill onClick={handleDrawPolygon}
//                         className='my-2 bg-black text-white font-semibold p-2 rounded-full' size={36} />
//                     <MdOutlineRectangle onClick={handleDrawRectangle}
//                         className='my-2 bg-black text-white font-semibold p-2 rounded-full' size={36} />
//                     <FaRegCircle onClick={handleDrawCircle}
//                         className='my-2 bg-black text-white font-semibold p-2 rounded-full' size={36} />
// const handleDrawPolygon = () => {
// 	const drawControl = new L.Draw.Polygon(map, {
// 		allowIntersection: false,
// 		shapeOptions: { color: "green" },
// 	  });
// 	  drawControl.enable(); // Activate the polygon drawing mode
//   };
	  
//   const handleDrawRectangle = () => {
// 	  const drawControl = new L.Draw.Rectangle(map, {
// 		shapeOptions: { color: "orange" },
// 	  });
// 	  drawControl.enable(); // Activate rectangle drawing mode
//   };
	  
//   const handleDrawCircle = () => {
// 	  const drawControl = new L.Draw.Circle(map, {
// 		shapeOptions: { color: "red" },
// 	  });
// 	  drawControl.enable(); // Activate circle drawing mode
//   };
	// const _onEdited = (e : any) => {
	// 	let numEdited = 0;
	// 	e.layers.eachLayer((layer : any) => {
	// 		numEdited += 1;
	// 	});
	// 	console.log(`_onEdited: edited ${numEdited} layers`, e);
	// };

	// const _onCreated = (e : any) => {
	// 	let type = e.layerType;
	// 	let layer = e.layer;
	// 	if (type === "marker") {
	// 		// Do marker specific actions
	// 		console.log("_onCreated: marker created", e);
	// 	} else {
	// 		console.log("_onCreated: something else created:", type, e);
	// 	}

	// 	console.log("Geojson", layer.toGeoJSON());
	// 	console.log("coords", layer.getLatLngs());
	// 	// Do whatever else you need to. (save to db; etc)

	// 	// this._onChange();
	// };

	// const _onDeleted = (e : any) => {
	// 	let numDeleted = 0;
	// 	e.layers.eachLayer(layer => {
	// 		numDeleted += 1;
	// 	});
	// 	console.log(`onDeleted: removed ${numDeleted} layers`, e);

	// 	// this._onChange();
	// };

	// const _onMounted = (drawControl: any) => {
	// 	console.log("_onMounted", drawControl);
	// };

	// const _onEditStart = (e : any) => {
	// 	console.log("_onEditStart", e);
	// };

	// const _onEditStop = (e : any) => {
	// 	console.log("_onEditStop", e);
	// };

	// const _onDeleteStart = (e : any) => {
	// 	console.log("_onDeleteStart", e);
	// };

	// const _onDeleteStop = (e : any) => {
	// 	console.log("_onDeleteStop", e);
	// };

	// const _onDrawStart = (e : any) => {
	// 	console.log("_onDrawStart", e);
	// };
// 	<MdPolyline onClick={handleDrawPolyline} size={36}
// 	className='my-2 bg-black text-white font-semibold p-2 rounded-full'
// />
	// Drawing handlers
	// const handleDrawPolyline = () => {
	// 	const drawControl = new L.Draw.Polyline(map, {
	// 	  shapeOptions: { color: "blue" },
	// 	});
	// 	drawControl.enable(); 
	// };

const DrawingPanel = () => {
	const map = useMap();
	const featureGroupRef = useRef<any>(null);
	const [areaName, setAreaName] = useState('');
	const [coordinates, setCoordinates] = useState([]);
	const [popupPosition, setPopupPosition] = useState(null);
	// const [toast, setToast] = useState({ isShown: false, message: '', type: 'success' });
	const { swedishFlagBlue } = useContext(MapStyleContext);

	useEffect(() => {
		if (!featureGroupRef.current) return;
		const drawnItems = featureGroupRef.current;
		map.addLayer(drawnItems);

		map.on("draw:created", (e: any) => {
			const layer = e.layer;
			drawnItems.addLayer(layer);
			const areaCoordinates = layer.getLatLngs().flatMap((latlng : any) =>
			 	Array.isArray(latlng) ? latlng.map((ll : any) => [ll.lng, ll.lat]) 
									  : [[latlng.lng, latlng.lat]]);
			setPopupPosition(layer.getBounds().getCenter());
			setCoordinates(areaCoordinates);
		});

		map.on("draw:deleted", (e: any) => {
			// delete the coordinates from the database
		})

		return () => {
			map.off("draw:created");
			map.off("draw:deleted");
		}
	}, [map]);

	const handleDrawPolygon = () => {
		// const color = mapType === 'osm' ? swedishFlagBlue : swedishFlagYellow;
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
		// setToast({ isShown: true, message: res.message, type: 'error' });
		// setToast({ isShown: true, message: res.message, type: 'success' });
		setPopupPosition(null);
		setAreaName('');
	};

	const deleteArea = async (areaId: any) => {
		// Delete the coordinates from the database
		const res = await API.removeArea(areaId);
		if (res.error) setToast({ isShown: true, message: res.message, type: 'error' });
		setToast({ isShown: true, message: res.message, type: 'success' });
	}

    return (
		<>
			<FeatureGroup ref={featureGroupRef}>
				<div className='absolute leaflet-top leaflet-left flex flex-col items-center justify-between gap-4 z-50 mt-40 ml-4'
					style={{ pointerEvents: 'auto' }}>
					<div>                    
						<PiPolygonFill onClick={handleDrawPolygon} size={40}
							className='my-2 bg-black text-white font-semibold p-2 rounded-full' 
						/>
						<MdDelete onClick={handleDeleteShapes} size={40}
							className='my-2 bg-black text-white font-semibold p-2 rounded-full' 
						/>               
					</div>
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