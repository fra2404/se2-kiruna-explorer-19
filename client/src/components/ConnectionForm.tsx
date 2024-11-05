import { useState, useEffect } from 'react';
import { Connection } from './DocumentForm';
import { ButtonRounded } from './Button';
import InputComponent from './atoms/input/input';
import API from '../API'; // Importa l'API

const ConnectionForm = ({
  setModalOpen,
  handleAddConnection,
  connection,
}: {
  setModalOpen: any;
  handleAddConnection: any;
  connection: Connection;
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

    console.log('New Connection:', newConnection); // Stampa newConnection per debug

    handleAddConnection(newConnection);
    setModalOpen(false); // Chiudi il modal dopo l'aggiunta
  };

  return (
    <div className="my-4 w-full max-w-[600px] md:mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="w-full">
          <InputComponent
            label="Connection type"
            type="select"
            options={connectionTypeOptions}
            value={type}
            onChange={(selectedOption: any) => setType(selectedOption)}
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
            onChange={(selectedOption: any) =>
              setTargetDocument(selectedOption)
            }
            required={true}
            placeholder="Select a document..."
            returnObject={true} // Passa l'intero oggetto selezionato
          />
        </div>
      </div>

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
