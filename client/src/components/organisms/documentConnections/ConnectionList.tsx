import React from 'react';
import { ConnectionItem } from '../../molecules/documentConnections/ConnectionItem';
import { Connection } from '../DocumentForm';
import { IDocument } from '../../../utils/interfaces/document.interface';

interface ConnectionListProps {
  connections: Connection[];
  handleDelete: (index: number) => void;
  allDocuments: IDocument[];
}

const ConnectionList: React.FC<ConnectionListProps> = ({
  connections,
  handleDelete,
  allDocuments
}) => {
  
  return (
    <div className="max-w-[500px] mx-auto p-4">
      {/* Headers */}
      <div className="grid grid-cols-3 gap-4 mb-2 font-semibold text-gray-600">
        <span>Type</span>
        <span>Document</span>
        <span className="text-right">Actions</span>
      </div>

      <dl className="bg-white rounded-lg p-4 divide-y divide-gray-200">
        {connections.map((connection: Connection, index: number) => (
          <ConnectionItem
            key={index}
            connection={connection}
            index={index}
            handleDelete={handleDelete}
            allDocuments={allDocuments}
          />
        ))}
      </dl>
    </div>
  );
};

export default ConnectionList;
