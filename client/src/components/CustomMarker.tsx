import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';


export default function CustomMarker(props) {
    const legalIcon = new Icon({
        iconUrl: 'https://img.icons8.com/external-icongeek26-linear-colour-icongeek26/64/external-legal-business-and-finance-icongeek26-linear-colour-icongeek26.png',
        //iconUrl: ReactDOMServer.renderToString(<AgreementIcon />),
        iconSize: [35, 35], // size of the icon
        iconAnchor: props.coordinates, // point of the icon which will correspond to marker's location
        popupAnchor: [-45, -20] // point from which the popup should open relative to the iconAnchor

    })

    return (
        <Marker position={props.coordinates} icon={legalIcon}>
            <Popup>
                {props.popupText /* this is the text that will be displayed in the popup */}
            </Popup>
        </Marker>
    )
}



