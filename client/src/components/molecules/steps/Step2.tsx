import React, { useState, useEffect, useRef } from 'react';
import InputComponent from '../../atoms/input/input';
import ButtonRounded from '../../atoms/button/ButtonRounded';
import { createDocumentType } from '../../../API'; // Importa le funzioni getDocumentTypes e createDocumentType
import { IDocumentType } from '../../../utils/interfaces/documentTypes.interface';
import { DocumentIcon } from '../documentsItems/DocumentIcon';
import { IStakeholder } from '../../../utils/interfaces/stakeholders.interface';
interface Step2Props {
  description: string;
  setDescription: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  docType: IDocumentType;
  setDocType: (value: IDocumentType) => void;
  documentTypeOptions: { value: string; label: string }[];
  setDocumentTypeOptions: (
    documentTypeOptions: { value: string; label: string }[],
  ) => void;
  stakeholders: IStakeholder[];
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
  setDocumentTypeOptions,
  stakeholders,
  errors,
}) => {
  const [isAddingNewDocType, setIsAddingNewDocType] = useState(false);
  const [newDocTypeLabel, setNewDocTypeLabel] = useState('');
  const [inputKey, setInputKey] = useState(0); // Adds a state for the dynamic key
  const newDocTypeInputRef = useRef<HTMLInputElement>(null); // Creates a reference for the input field

  useEffect(() => {
    setInputKey((prevKey) => prevKey + 1); // Forces the pagve refresh when docType changes
  }, [docType]);

  useEffect(() => {
    if (isAddingNewDocType && newDocTypeInputRef.current) {
      newDocTypeInputRef.current.focus(); // Sets the focus on the input field
    }
  }, [isAddingNewDocType]);

  const handleSaveNewDocType = async () => {
    try {
      const newDocType = await createDocumentType(newDocTypeLabel);
      const formattedDocType = {
        value: newDocType.value,
        label: newDocType.label,
        icon: (
          <DocumentIcon
            type={newDocType.label}
            stakeholders={stakeholders.map((s) => ({
              _id: s._id,
              type: s.type,
            }))}
          />
        ),
      };
      setDocumentTypeOptions([...documentTypeOptions, formattedDocType]);
      setDocType({ _id: newDocType.value, type: newDocType.label });
      setIsAddingNewDocType(false);
      setNewDocTypeLabel('');
    } catch (error) {
      console.error('Error when creating a new document:', error);
    }
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
      {documentTypeOptions.length > 0 && (
        <div className="my-2 col-span-2">
          <InputComponent
            key={inputKey} // Add the dynamic key here
            label="Type"
            type="select"
            options={documentTypeOptions}
            value={docType._id} // Passes the docType id as value
            onChange={(e) => {
              if ('target' in e) {
                const selectedOption = documentTypeOptions.find(
                  (option) => option.value === e.target.value,
                );
                if (selectedOption) {
                  setDocType({
                    _id: selectedOption.value,
                    type: selectedOption.label,
                  });
                }
              }
            }}
            defaultValue={docType._id}
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveNewDocType();
                  }
                }}
                inputRef={newDocTypeInputRef} // Sets the input field ref
              />
              <ButtonRounded
                variant="filled"
                text="Confirm"
                className="ml-4 bg-black text-white text-xs pt-2 pb-2 pl-3 pr-3"
                onClick={handleSaveNewDocType}
              >
                Confirm
              </ButtonRounded>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Step2;
