import React from "react";
import { FaQuestion } from "react-icons/fa";

import {
  AgreementIcon,
  ConflictIcon,
  ConsultationIcon,
  DesignDocIcon,
  InformativeDocIcon,
  MaterialEffectsIcon,
  PrescriptiveDocIcon,
  TechnicalDocIcon,
} from "../../../assets/icons";

interface DocumentIconProps {
  type: string,
  stakeholders: string | undefined
}

export const DocumentIcon: React.FC<DocumentIconProps> = ({
  type,
  stakeholders
}) => {
  const fillColor = "black";          // TODO: fillColor will depend on stakeholder(s)

  //Define custom icons for different categories
  if (type.toUpperCase() === 'AGREEMENT') {
    return (<AgreementIcon fillColor={fillColor} />)
  } else if (type.toUpperCase() === 'CONFLICT') {
    return (<ConflictIcon fillColor={fillColor} />)
  } else if (type.toUpperCase() === 'CONSULTATION') {
    return (<ConsultationIcon fillColor={fillColor} />)
  } else if (type.toUpperCase() === 'DESIGN_DOC') {
    return (<DesignDocIcon fillColor={fillColor} />)
  } else if (type.toUpperCase() === 'INFORMATIVE_DOC') {
    return (<InformativeDocIcon fillColor={fillColor} />)
  } else if (type.toUpperCase() === 'MATERIAL_EFFECTS') {
    return (<MaterialEffectsIcon fillColor={fillColor} />)
  } else if (type.toUpperCase() === 'PRESCRIPTIVE_DOC') {
    return (<PrescriptiveDocIcon fillColor={fillColor} />)
  } else if (type.toUpperCase() === 'TECHNICAL_DOC') {
    return (<TechnicalDocIcon fillColor={fillColor} />)
  } else {
    // Default icon if type doesn't match any of the above
    return (<FaQuestion size={22} />);
  }
}