import Select from 'react-select';
import { useState } from 'react';
import { Connection } from './DocumentForm';

const ConnectionForm = ({ setModalOpen, handleAddConnection, connection }: { setModalOpen: any; handleAddConnection: any, connection : Connection }) => {

    const connectionTypeOptions = [
        { value: "Direct", label: "Direct" },
        { value: "Collateral", label: "Collateral" },
        { value: "Projection", label: "Projection" },
        { value: "Update", label: "Update" },
    ];

    const targetDocumentOptions = [
        { value: "Document 1", label: "Document 1" },
        { value: "Document 2", label: "Document 2" },
        { value: "Document 3", label: "Document 3" },
        { value: "Document 4", label: "Document 4" }
    ];

    const [type, setType] = useState<any>({ value: connection?.type, label: connection?.type } || null);
    const [targetDocument, setTargetDocument] = useState<any>({ value: connection?.relatedDocument, label: connection?.relatedDocument }  || null);

    const handleSubmit = (e: any) => {
      e.preventDefault();
      const connection: Connection = {
        type: type?.value || "",
        relatedDocument: targetDocument?.value || ""
      }
      handleAddConnection(connection)
    }

    return (
      <div className="my-4 w-full max-w-[600px] md:mx-auto p-8">
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          <div className='w-full'>
            <label className="mr-1 font-semibold">Connection type</label>
            <span className="text-red-600">*</span>
            <Select 
              className="mt-2"
              defaultValue={type}
              onChange={setType}
              options={connectionTypeOptions} placeholder="Select a type..." />
          </div>

          <div className='w-full'>
            <label className="mr-1 font-semibold">Target document</label>
            <span className="text-red-600">*</span>
            <Select 
              className="mt-2" 
              defaultValue={targetDocument}
              onChange={setTargetDocument}
              options={targetDocumentOptions} placeholder="Select a document..."
              />
          </div>
        </div>
        
        <div className='w-1/2 flex items-center justify-center mx-auto gap-4'>
          <button onClick={handleSubmit} type='button' className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded mt-4">Add</button>
          <button onClick={() => setModalOpen(false)} type='button' className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded mt-4">Cancel</button>
        </div>
      </div>
    );
};

export default ConnectionForm;
