//In this file, the styles for areas/points icons are defined. I tried to return a react component instead of just a style, but it does not work with renderToString() function

import { useContext } from 'react';
import MapStyleContext from '../../context/MapStyleContext';
import { IDocument } from '../../utils/interfaces/document.interface';

export function CoordsIconStyle(
  coordDocuments: IDocument[],
  pointy: boolean,
  allMunicipality: boolean
): {} {
  const { swedishFlagBlue, satMapMainColor, mapType } =
    useContext(MapStyleContext);

  let bgColor, size, textColor, padding;

  if(!allMunicipality) {
    if(coordDocuments.length != 1) {
      bgColor = mapType == 'sat' ? satMapMainColor : swedishFlagBlue;
      padding = '0px';
    }
    else {
      bgColor = 'white';
      padding = '1px';
    }
    size = '40px';
    textColor = mapType == 'sat' ? 'black' : 'white';
  }
  else {
    bgColor = '#1B1B1B';
    size = '50px';
    textColor = 'white';
    padding = '0px';
  }

  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: size,
    height: size,
    color: textColor,
    borderRadius: pointy ? '50% 50% 50% 0%' : '50% 50% 50% 50%',
    transform: 'rotate(-45deg)',
    fontSize: '20px',
    fontWeight: 'bold',
    border: '2px solid black',
    padding: padding,
    backgroundColor: bgColor,
  };
}
