import { Connection } from './DocumentForm';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";

export interface ConnectionListProps {
    connections: Connection[];
    handleDelete: (index: number) => void;
    handleEdit: (index: number) => void;
    openEditForm: (index: number) => void;
}

const ConnectionList = ({
    connections,
    handleDelete,
    openEditForm
}: ConnectionListProps) => {
  
    return (
        <>
            <div className="max-w-[500px] p-4">

                {/* Headers */}
                <div className="grid grid-cols-3 gap-4 mb-2 font-semibold text-gray-600">
                    <span>Type</span>
                    <span>Document</span>
                    <span>Actions</span>
                </div>

                <dl className="bg-white rounded-lg divide-y divide-gray-200">
                    {connections.map((connection, index) => (
                        <div key={index} className="grid grid-cols-3 gap-4 py-2 items-center">
                            <dt className="font-medium text-gray-700">{connection.type}</dt>
                            <dd className="text-gray-900">{connection.relatedDocument}</dd>
                            <div className='flex'>
                                <FaEdit onClick={() => openEditForm(index)} className="text-blue-600 hover:text-blue-500 mr-1" />
                                <MdDelete onClick={() => handleDelete(index)} className="text-red-600 hover:text-red-500" />
                            </div>
                        </div>
                    ))}
                </dl>
            </div>
        </>
    );
}

export default ConnectionList;