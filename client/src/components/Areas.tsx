import { LatLngExpression } from "leaflet";
import { Polygon, Popup } from "react-leaflet";

export default function Areas() {
    //Hard coded areas, will be retrieved from the backend when we will have it
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

    return areas;
}