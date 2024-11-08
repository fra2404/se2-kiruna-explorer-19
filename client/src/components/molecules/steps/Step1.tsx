import React from 'react';
import InputComponent from '../../atoms/input/input';

interface Step1Props {
  title: string;
  setTitle: (value: string) => void;
  stakeholders: string;
  setStakeholders: (value: string) => void;
  scale: string;
  setScale: (value: string) => void;
  issuanceDate: string;
  setIssuanceDate: (value: string) => void;
}

const Step1: React.FC<Step1Props> = ({
  title,
  setTitle,
  stakeholders,
  setStakeholders,
  scale,
  setScale,
  issuanceDate,
  setIssuanceDate,
}) => {
  return (
    <>
      {/* Title */}
      <div className="my-2">
        <InputComponent
          label="Title"
          type="text"
          value={title}
          onChange={(v) => {
            if ('target' in v) {
              setTitle(v.target.value);
            }
          }}
          required={true}
          placeholder="Enter title"
        />
      </div>

      {/* Stakeholders */}
      <div className="my-2">
        <InputComponent
          label="Stakeholder"
          type="text"
          value={stakeholders}
          onChange={(v) => {
            if ('target' in v) {
              setStakeholders(v.target.value);
            }
          }}
          required={true}
          placeholder="Enter stakeholder"
        />
      </div>

      {/* Scale of document */}
      <div className="my-2">
        <InputComponent
          label="Scale"
          type="text"
          value={scale}
          onChange={(v) => {
            if ('target' in v) {
              setScale(v.target.value);
            }
          }}
          required={true}
          placeholder="Enter scale"
        />
      </div>

      {/* Issuance date of document */}
      <div className="my-2">
        <InputComponent
          label="Issuance date"
          type="date"
          value={issuanceDate}
          onChange={(e) => {
            if ('target' in e) {
              setIssuanceDate(e.target.value);
            }
          }}
          required={true}
          placeholder="Select issuance date"
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
    </>
  );
};

export default Step1;
