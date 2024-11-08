import React, { useState, useEffect } from 'react';
import { ConnectionFormFields } from '../molecules/ConnectionFormFields';
import { Connection } from './DocumentForm';
import API from '../../API';
import ButtonRounded from '../atoms/button/ButtonRounded';

interface ConnectionFormProps {
  setModalOpen: (open: boolean) => void;
  handleAddConnection: (connection: Connection) => void;
  connection: Connection;
}

const ConnectionForm: React.FC<ConnectionFormProps> = ({
  setModalOpen,
  handleAddConnection,
  connection,
}) => {
  const connectionTypeOptions = [
    { value: 'DIRECT', label: 'Direct' },
    { value: 'COLLATERAL', label: 'Collateral' },
    { value: 'PROJECTION', label: 'Projection' },
    { value: 'UPDATE', label: 'Update' },
  ];

  const [targetDocumentOptions, setTargetDocumentOptions] = useState<any[]>([]);
  const [type, setType] = useState<any>({
    value: connection?.type,
    label: connection?.type,
  });
  const [targetDocument, setTargetDocument] = useState<any>(
    connection?.relatedDocument
      ? { value: connection.relatedDocument, label: connection.relatedDocument }
      : null,
  );

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documents = await API.getDocuments();
        const options = documents.map((doc: any) => ({
          value: doc.id,
          label: doc.title,
        }));
        setTargetDocumentOptions(options);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Selected Type:', type);
    console.log('Selected Target Document:', targetDocument);

    const newConnection: Connection = {
      type: type.target.value || '',
      relatedDocument: targetDocument,
    };

    console.log('New Connection:', newConnection);

    handleAddConnection(newConnection);
    setModalOpen(false);
  };

  return (
    <div className="my-4 w-full max-w-[600px] md:mx-auto p-8">
      <ConnectionFormFields
        connectionTypeOptions={connectionTypeOptions}
        targetDocumentOptions={targetDocumentOptions}
        type={type}
        setType={setType}
        targetDocument={targetDocument}
        setTargetDocument={setTargetDocument}
      />

      <div className="w-full flex justify-center gap-4">
        <ButtonRounded
          variant="filled"
          text="Add"
          className="bg-black text-white text-base pt-2 pb-2 pl-4 pr-4 rounded mt-4"
          onClick={handleSubmit}
        />
        <ButtonRounded
          variant="outlined"
          text="Cancel"
          className="text-base pt-2 pb-2 pl-4 pr-4 mt-4"
          onClick={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default ConnectionForm;
