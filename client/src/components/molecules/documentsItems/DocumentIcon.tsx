import React from 'react';
import { FaQuestion } from 'react-icons/fa';

import {
  AgreementIcon,
  ConflictIcon,
  ConsultationIcon,
  DesignDocIcon,
  InformativeDocIcon,
  MaterialEffectsIcon,
  PrescriptiveDocIcon,
  TechnicalDocIcon,
} from '../../../assets/icons';

export const stakeholdersColors = (
  stakeholders: (string | undefined)[],
): string[] => {
  if (stakeholders.length === 0) {
    return ['#000'];
  }

  const colors = stakeholders.map((stakeholder) => {
    switch (typeof stakeholder === 'string' ? stakeholder.toLowerCase() : undefined) {      
      case 'lkab':
        return '#1b1c1f';
      case 'municipality':
        return '#82605c';
      case 'regional authority':
        return '#64242e';
      case 'architecture firms':
        return '#aca596';
      case 'citizens':
        return '#a7cbce';
      default:
        return '#829c9f';
    }
  });

  return colors;
};

interface DocumentIconProps {
  type: string;
  stakeholders: string | string[] | undefined;
}

export const DocumentIcon: React.FC<DocumentIconProps> = ({
  type,
  stakeholders,
}) => {
  const stakeholdersArray = Array.isArray(stakeholders)
    ? stakeholders
    : [stakeholders];
  const colors = stakeholdersColors(stakeholdersArray);

  // Define custom icons for different categories
  if (!type) return <FaQuestion size={20} />;
  switch (type.toUpperCase()) {
    case 'AGREEMENT':
      return <AgreementIcon fillColor={colors} />;
    case 'CONFLICT':
      return <ConflictIcon fillColor={colors} />;
    case 'CONSULTATION':
      return <ConsultationIcon fillColor={colors} />;
    case 'DESIGN_DOC':
      return <DesignDocIcon fillColor={colors} />;
    case 'INFORMATIVE_DOC':
      return <InformativeDocIcon fillColor={colors} />;
    case 'MATERIAL_EFFECTS':
      return <MaterialEffectsIcon fillColor={colors} />;
    case 'PRESCRIPTIVE_DOC':
      return <PrescriptiveDocIcon fillColor={colors} />;
    case 'TECHNICAL_DOC':
      return <TechnicalDocIcon fillColor={colors} />;
    default:
      // Default icon if type doesn't match any of the above
      return <FaQuestion size={20} />;
  }
};
