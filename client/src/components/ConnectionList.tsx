import { Connection } from './DocumentForm';
import { FaTrash } from 'react-icons/fa';

interface ConnectionListProps {
  connections: Connection[];
  handleDelete: (index: number) => void;
}

const ConnectionList: React.FC<ConnectionListProps> = ({
  connections,
  handleDelete,
}) => {
  console.log('connections:', connections);
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
          <div key={index} className="grid grid-cols-3 gap-4 py-2 items-center">
            <dt className="font-medium text-gray-700">{connection.type}</dt>
            <dd className="text-gray-900">
              {connection.relatedDocument.label}
            </dd>
            <div className="text-right">
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(index)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default ConnectionList;
