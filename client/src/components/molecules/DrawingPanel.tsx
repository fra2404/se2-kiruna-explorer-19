import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";

import { MdPolyline, MdDelete, MdEdit } from "react-icons/md";
import { PiPolygonFill } from "react-icons/pi";
import { MdOutlineRectangle } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";

const DrawingPanel = () => {

    return (
        <div className='absolute leaflet-top leaflet-left flex flex-col items-center justify-between gap-4 z-50 mt-40 ml-4'
        style={{ pointerEvents: 'auto' }}
        >
            <div>
                <MdPolyline
                    className='my-2 bg-black text-white font-semibold p-2 rounded-full' size={36} />
                <PiPolygonFill
                    className='my-2 bg-black text-white font-semibold p-2 rounded-full' size={36} />
                <MdOutlineRectangle
                    className='my-2 bg-black text-white font-semibold p-2 rounded-full' size={36} />
                <FaRegCircle
                    className='my-2 bg-black text-white font-semibold p-2 rounded-full' size={36} />
            </div>

            <div>
                <MdEdit className='my-2 bg-black text-white font-semibold p-2 rounded-full' size={36} />
                <MdDelete className='my-2 bg-black text-white font-semibold p-2 rounded-full' size={36} />
            </div>
        </div>
    );
}

export default DrawingPanel;