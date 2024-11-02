import { useState } from 'react';
import { Connection } from './DocumentForm';

const ConnectionList = ({ connections, handleDelete, handleEdit, handleAddConnection }) => {
    const [onEdit, setOnEdit] = useState(false);
    const [indexToEdit, setIndexToEdit] = useState(null);
    
    return (
        <div className="max-w-[500px] mx-auto p-4">

            {/* Headers */}
            <div className="grid grid-cols-2 gap-4 mb-2 font-semibold text-gray-600">
                <span>Type</span>
                <span>Document</span>
                {/*<span className="text-right">Actions</span>*/}
            </div>

            <dl className="bg-white rounded-lg p-4 divide-y divide-gray-200">
                {connections.map((connection, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 py-2 items-center">
                        <dt className="font-medium text-gray-700">{connection.type}</dt>
                        <dd className="text-gray-900">{connection.relatedDocument}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

export default ConnectionList;