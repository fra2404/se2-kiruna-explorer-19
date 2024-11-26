import React, { useState, useEffect } from 'react';
import InputComponent from '../../atoms/input/input';
import './Step1.css';

interface Step1Props {
  title: string;
  setTitle: (value: string) => void;
  stakeholders: string[];
  setStakeholders: (value: string[]) => void;
  scale: string;
  setScale: (value: string) => void;
  issuanceDate: string;
  setIssuanceDate: (value: string) => void;
  customScale: string;
  setCustomScale: (value: string) => void;
  errors: { [key: string]: string };
}

const stakeholderOptions = [
  { value: 'LKAB', label: 'LKAB' },
  { value: 'Municipalty', label: 'Municipalty' },
  { value: 'RegionalAuthority', label: 'Regional Authority' },
  { value: 'ArchitectureFirms', label: 'Architecture Firms' },
  { value: 'Citizens', label: 'Citizens' },
  { value: 'Others', label: 'Others' },
];

const scaleOptions = [
  { value: 'Architectural Style', label: 'Architectural Style' },
  { value: 'pippo', label: 'pippo' },
  { value: 'pluto', label: 'pluto' },
  { value: 'altro', label: 'altro' },
];

const Step1: React.FC<Step1Props> = ({
  title,
  setTitle,
  stakeholders,
  setStakeholders,
  scale,
  setScale,
  issuanceDate,
  setIssuanceDate,
  customScale,
  setCustomScale,
  errors,
}) => {
  useEffect(() => {
    console.log('useEffect - scale:', scale);
    if (scale !== 'Architectural Style') {
      setCustomScale('');
    }
  }, [scale, setCustomScale]);

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
          error={errors.title}
        />
      </div>

      {/* Stakeholders */}
      <div className="my-2">
        <InputComponent
          label="Stakeholder(s)"
          type="multi-select"
          options={stakeholderOptions}
          value={stakeholders.map((stakeholder) => ({
            value: stakeholder,
            label: stakeholder,
          }))}
          onChange={(selectedOptions) => {
            setStakeholders(
              selectedOptions
                ? Array.isArray(selectedOptions)
                  ? selectedOptions.map((option) => option.value)
                  : []
                : [],
            );
          }}
          required={true}
          placeholder="Select stakeholder(s)"
          error={errors.stakeholders}
        />
      </div>

      {/* Scale of document */}
      <div
        className={`my-2 ${scale === 'Architectural Style' ? 'inline-fields' : ''}`}
      >
        <InputComponent
          label="Scale"
          type="select"
          options={scaleOptions}
          value={{ value: scale, label: scale }}
          onChange={(e) => {
            if ('target' in e) {
              const selectedOption = e.target.value;
              console.log('onChange - selectedOption:', selectedOption);
              setScale(selectedOption);
            }
          }}
          required={true}
          placeholder="Select scale"
          error={errors.scale}
        />

        {/* Custom Scale Input */}
        {scale === 'Architectural Style' && (
          <InputComponent
            label="Custom Scale"
            type="text"
            value={customScale}
            onChange={(v) => {
              if ('target' in v) {
                setCustomScale(v.target.value);
              }
            }}
            required={true}
            placeholder="Enter custom scale"
            error={errors.customScale}
          />
        )}
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
          error={errors.issuanceDate}
        />
      </div>
    </>
  );
};

export default Step1;
