import { renderToString } from 'react-dom/server';
import { DivIcon, Icon } from 'leaflet';
import AgreementIcon from '../assets/icons/agreement-icon';
import ConflictIcon from '../assets/icons/conflict-icon';
import ConsultationIcon from '../assets/icons/consultation-icon';
import DesignDocIcon from '../assets/icons/design-doc-icon';
import InformativeDocIcon from '../assets/icons/informative-doc-icon';
import MaterialEffectsIcon from '../assets/icons/material-effects-icon';
import PrescriptiveDocIcon from '../assets/icons/prescriptive-doc-icon';
import TechnicalDocIcon from '../assets/icons/technical-doc-icon';

export const getTypeIcon = (type: string, fillColor: string) => {
  if (type === 'Agreement') {
    return new DivIcon({
      iconSize: [35, 35],
      className: 'agreementIcon',
      html: renderToString(<AgreementIcon fillColor={fillColor} />),
    });
  } else if (type === 'Conflict') {
    return new DivIcon({
      iconSize: [35, 35],
      className: 'conflictIcon',
      html: renderToString(<ConflictIcon fillColor={fillColor} />),
    });
  } else if (type === 'Consultation') {
    return new DivIcon({
      iconSize: [35, 35],
      className: 'consultationIcon',
      html: renderToString(<ConsultationIcon fillColor={fillColor} />),
    });
  } else if (type === 'Design document') {
    return new DivIcon({
      iconSize: [35, 35],
      className: 'designDocIcon',
      html: renderToString(<DesignDocIcon fillColor={fillColor} />),
    });
  } else if (type === 'Informative document') {
    return new DivIcon({
      iconSize: [35, 35],
      className: 'informativeDocIcon',
      html: renderToString(<InformativeDocIcon fillColor={fillColor} />),
    });
  } else if (type === 'Material effects') {
    return new DivIcon({
      iconSize: [35, 35],
      className: 'materialEffectsIcon',
      html: renderToString(<MaterialEffectsIcon fillColor={fillColor} />),
    });
  } else if (type === 'Prescriptive document') {
    return new DivIcon({
      iconSize: [35, 35],
      className: 'prescriptiveDocIcon',
      html: renderToString(<PrescriptiveDocIcon fillColor={fillColor} />),
    });
  } else if (type === 'Technical document') {
    return new DivIcon({
      iconSize: [35, 35],
      className: 'technicalDocIcon',
      html: renderToString(<TechnicalDocIcon fillColor={fillColor} />),
    });
  } else {
    return new Icon({
      iconUrl: 'path/to/icon.png',
      iconSize: [38, 45],
    });
  }
};
