//In this file, the styles for areas/points icons are defined. I tried to return a react component instead of just a style, but it does not work with renderToString() function

import { useContext } from 'react';
import MapStyleContext from '../../context/MapStyleContext';
import { IDocument } from '../../utils/interfaces/document.interface';

export function CoordsIconStyle(
  coordDocuments: IDocument[],
  pointy: boolean,
): {} {
  const { swedishFlagBlue, satMapMainColor, mapType } =
    useContext(MapStyleContext);

  const bgColor = mapType == 'sat' ? satMapMainColor : swedishFlagBlue;

  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40px',
    height: '40px',
    color: mapType == 'sat' ? 'black' : 'white',
    borderRadius: pointy ? '50% 50% 50% 0%' : '50% 50% 50% 50%',
    transform: 'rotate(-45deg)',
    fontSize: '20px',
    fontWeight: 'bold',
    border: '2px solid black',
    padding: coordDocuments.length == 1 ? '1px' : '0px',
    backgroundColor: coordDocuments.length == 1 ? 'white' : bgColor,
  };
}
