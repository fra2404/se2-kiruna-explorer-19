import React from 'react';
import InputComponent from '../../atoms/input/input';

interface Step2Props {
  description: string;
  setDescription: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  docType: string;
  setDocType: (value: string) => void;
  documentTypeOptions: { value: string; label: string }[];
  errors: { [key: string]: string };
}

const Step2: React.FC<Step2Props> = ({
  description,
  setDescription,
  language,
  setLanguage,
  docType,
  setDocType,
  documentTypeOptions,
  errors,
}) => {
  return (
    <>
      {/* Description */}
      <div className="my-2 col-span-2">
        <InputComponent
          label="Description"
          type="textarea"
          value={description}
          onChange={(e) => {
            if ('target' in e) {
              setDescription(e.target.value);
            }
          }}
          required={false}
          placeholder="Enter description"
          maxLength={1000}
          error={errors.description}
        />
      </div>

      {/* Language */}
      <div className="my-2">
        <InputComponent
          label="Language"
          type="text"
          value={language}
          onChange={(e) => {
            if ('target' in e) {
              setLanguage(e.target.value);
            }
          }}
          placeholder="Enter language"
          error={errors.language}
        />
      </div>

      {/* Type of document */}
      <div className="my-2 col-span-2">
        <InputComponent
          label="Type"
          type="select"
          options={documentTypeOptions}
          defaultValue={docType}
          value={docType}
          onChange={(e) => {
            if ('target' in e) {
              setDocType(e.target.value);
            }
          }}
          required={true}
          placeholder="Select document type..."
          error={errors.docType}
        />
      </div>
    </>
  );
};

export default Step2;
