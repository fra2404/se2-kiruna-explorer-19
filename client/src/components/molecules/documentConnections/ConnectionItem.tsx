import React from 'react';
import { Connection } from '../../organisms/DocumentForm';
import { DeleteButton } from '../../atoms/button/DeleteButton';
import { IDocument } from '../../../utils/interfaces/document.interface';

interface ConnectionItemProps {
  connection: Connection;
  index: number;
  handleDelete: (index: number) => void;
  allDocuments: IDocument[];
}

export const ConnectionItem: React.FC<ConnectionItemProps> = ({
  connection,
  index,
  handleDelete,
  allDocuments
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 py-2 items-center">
      <dt className="font-medium text-gray-700">{connection.type}</dt>
      <dd className="text-gray-900">{allDocuments.find((d) => d.id == connection.relatedDocument)?.title}</dd>
      <div className="text-right">
        <DeleteButton onClick={() => handleDelete(index)} />
      </div>
    </div>
  );
};
