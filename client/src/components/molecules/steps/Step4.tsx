import React from 'react';
import ConnectionList from '../../organisms/documentConnections/ConnectionList';
import ButtonRounded from '../../atoms/button/ButtonRounded';
import { IDocument } from '../../../utils/interfaces/document.interface';

interface Step4Props {
  connections: any[];
  handleDeleteConnection: (index: number) => void;
  setConnectionModalOpen: (open: boolean) => void;
  allDocuments: IDocument[];
}

const Step4: React.FC<Step4Props> = ({
  connections,
  handleDeleteConnection,
  setConnectionModalOpen,
  allDocuments,
}) => {
  return (
    <>
      {/* Connections */}
      <div className="my-2 col-span-2">
        <span className="font-semibold">Connections</span>

        {connections?.length === 0 ? (
          <p className="mt-1 text-gray-500">No connections yet</p>
        ) : (
          connections?.length > 0 && (
            <ConnectionList
              connections={connections}
              handleDelete={handleDeleteConnection}
              allDocuments={allDocuments}
            />
          )
        )}

        <div className="flex items-center justify-center max-w-[100px] md:mx-auto my-2">
          <ButtonRounded
            variant="filled"
            text="Add Connection"
            className="bg-black text-white text-xs pt-2 pb-2 pl-3 pr-3"
            onClick={() => setConnectionModalOpen(true)}
          />
        </div>
      </div>
    </>
  );
};

export default Step4;
