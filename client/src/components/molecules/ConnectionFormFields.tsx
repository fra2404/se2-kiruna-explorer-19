import React from 'react';
import InputComponent from '../atoms/input/input';

interface ConnectionFormFieldsProps {
  connectionTypeOptions: any[];
  targetDocumentOptions: any[];
  type: any;
  setType: (selectedOption: any) => void;
  targetDocument: any;
  setTargetDocument: (selectedOption: any) => void;
}

export const ConnectionFormFields: React.FC<ConnectionFormFieldsProps> = ({
  connectionTypeOptions,
  targetDocumentOptions,
  type,
  setType,
  targetDocument,
  setTargetDocument,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div className="w-full">
        <InputComponent
          label="Connection type"
          type="select"
          options={connectionTypeOptions}
          value={type}
          onChange={setType}
          required={true}
          placeholder="Select a type..."
        />
      </div>

      <div className="w-full">
        <InputComponent
          label="Target document"
          type="select"
          options={targetDocumentOptions}
          value={targetDocument}
          onChange={setTargetDocument}
          required={true}
          placeholder="Select a document..."
          returnObject={true}
        />
      </div>
    </div>
  );
};
