import { LatLng } from "leaflet";
import { municipalityCoordinates } from "./municipalityCoordinates";

export const isMarkerInsideKiruna: (
  position: LatLng
)=> boolean = (position) => {
  let inside = false;

  for(let polyPoints of municipalityCoordinates) {
    inside = false; 

    let x = position.lat, y = position.lng;
    for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        let xi = polyPoints[i][1], yi = polyPoints[i][0];   //I invert lat and lng, since in the GeoJSON they are in format [lng, lat]
        let xj = polyPoints[j][1], yj = polyPoints[j][0];

        let intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect)
          inside = !inside;
    }
    if(inside) {
      return true;
    }
  }

  return inside;
};