import React, { useState } from 'react';
import InputComponent from '../../atoms/input/input';
import ButtonRounded from '../../atoms/button/ButtonRounded';

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
  const [isAddingNewDocType, setIsAddingNewDocType] = useState(false);
  const [newDocTypeLabel, setNewDocTypeLabel] = useState('');
  const [docTypeOptions, setDocTypeOptions] = useState(documentTypeOptions);

  const handleSaveNewDocType = (newDocType: { value: string; label: string }) => {
    const newOption = { value: newDocTypeLabel, label: newDocTypeLabel };
    setDocTypeOptions([...docTypeOptions, newOption]);
    setDocType(newOption.value);
    setIsAddingNewDocType(false);
    setNewDocTypeLabel('');
  };

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
          options={docTypeOptions}
          value={{ value: docType, label: docType }}
          onChange={(e) => {
            if ('target' in e) {
              setDocType(e.target.value);
            }
          }}
          required={true}
          placeholder="Select document type..."
          error={errors.docType}
          addNew={true}
          onAddNewSelect={() => setIsAddingNewDocType(true)}
        />
        {isAddingNewDocType && (
          <div className="flex items-center p-2 mt-2">
            <InputComponent
              label="New Document Type"
              type="text"
              value={newDocTypeLabel}
              onChange={(v) => {
                if ('target' in v) {
                  setNewDocTypeLabel(v.target.value);
                }
              }}
              placeholder="Enter new document type"
              required={true}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveNewDocType({ value: newDocTypeLabel, label: newDocTypeLabel });
                }
              }}
            />
            <ButtonRounded
              variant="filled"
              text="Confirm"
              className="ml-4 bg-black text-white text-xs pt-2 pb-2 pl-3 pr-3"
              onClick={() => handleSaveNewDocType({ value: newDocTypeLabel, label: newDocTypeLabel })}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Step2;