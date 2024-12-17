import React from 'react';

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
import DefaultIcon from '../../../assets/icons/default-icon';

// Hash function to convert a string in a numeric value
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Function to convert a numeric value in an hexadecimal color
const numberToColorHex = (num: number): string => {
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  // Computes color brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // If the color is too bright, make it darker
  if (brightness > 200 || (r > 200 && g > 200 && b > 200)) {
    r = Math.floor(r * 0.7);
    g = Math.floor(g * 0.7);
    b = Math.floor(b * 0.7);
  }

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const stakeholdersColors = (
  stakeholders: { _id: string; type: string }[],
): string[] => {
  if (stakeholders.length === 0) {
    return ['#000'];
  }

  const colors = stakeholders.map((stakeholder) => {
    if (stakeholder.type) {
      switch (stakeholder.type.toLowerCase()) {
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
          // Generatex a unique Hexadecimal color for not-predefined stakeholder types
          return numberToColorHex(hashString(stakeholder.type));
      }
    } else {
      return '#829c9f';
    }
  });

  return colors;
};

interface DocumentIconProps {
  type: string;
  stakeholders: { _id: string; type: string }[];
}

export const DocumentIcon: React.FC<DocumentIconProps> = ({
  type,
  stakeholders,
}) => {
  const colors = stakeholdersColors(stakeholders);

  // Define custom icons for different categories
  if (!type || typeof type !== 'string') return <DefaultIcon fillColor={colors} />;
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
      return <DefaultIcon fillColor={colors} />;;
  }
};
