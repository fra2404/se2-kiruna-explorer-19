import React, { useState, useEffect } from 'react';
import { MapContainer, Polygon, Popup, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from 'leaflet';


export default function KirunaMap() {
    const position: LatLngExpression = [67.85572, 20.22513];   // this are DD coordinates for Kiruna different from DMS coordinates for Kiruna

    useEffect(() => {
        console.log('Map container rendered');
    }, []);

    const areasCoords: Record<string, LatLngExpression[]> = {
        "City center": [[67.854844, 20.243384], [67.849990, 20.243727], [67.850702, 20.266230], [67.857173, 20.265538]],
        "Luossajarvi": [[67.862737, 20.186711], [67.868170, 20.166441], [67.877093, 20.165441], [67.874507, 20.186398], [67.866747, 20.198250]],
        "Kiirunavaaragruvan": [[67.839309, 20.214946], [67.833351, 20.225252], [67.833092, 20.203952]]
    };

    const areas = Object.entries(areasCoords).map(([areaName,coords]) => {
        return (<Polygon key={areaName} pathOptions={{color: "blue"}} positions={coords}>
            <Popup>{areaName}</Popup>
        </Polygon>)
    });

    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);



    return (
        <div style={{ width: width, height: height }}>   {/* This is needed to avoid glitch in the visualization of the map */}
            <header style={{ position: "absolute", top: 0, left: 0, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "rgba(255, 255, 255, 0.0)", zIndex: 1000 }}>
                <h1>Kiruna Map</h1>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src="./assets/logo.png" alt="Login" style={{ width: "2rem", height: "2rem", cursor: "pointer" }} />
                </div>
            </header>
            <MapContainer
                style={{ width: "100%", height: "100%" }}
                center={position}
                zoom={13}
                scrollWheelZoom={false}
                maxBounds={[[67.800, 19.900], [67.900, 20.500]]}    // Limit the map dimension to Kiruna area
                maxBoundsViscosity={0.9}    // It gives a "rubber band" effect when you try to move the map outside the bounds
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    areas
                }
            </MapContainer>
        </div>
    );
}