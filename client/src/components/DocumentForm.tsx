import { useState } from 'react';
import Select from 'react-select';
import ConnectionList from './ConnectionList';
import ConnectionForm from './ConnectionForm';
import { FaPlus } from 'react-icons/fa';
import Modal from "react-modal";

Modal.setAppElement("#root");

export interface Connection {
  type: string;
  relatedDocument: string;
}

const DocumentForm = () => {
    const stakeholdersOptions = [
        { value: "Kiruna Kommun", label: "Kiruna Kommun" },
        { value: "Kiruna Kommun / Residents", label: "Kiruna Kommun / Residents" },
        { value: "Kiruna Kommun / White Arkitekter", label: "Kiruna Kommun / White Arkitekter" },
        { value: "LKAB", label: "LKAB" }
    ];

    const documentTypeOptions = [
        { value: "Material effect", label: "Material effect" },
        { value: "Prescriptive document", label: "Prescriptive document" },
        { value: "Design document", label: "Design document" },
        { value: "Informative document", label: "Informative document" },
        { value: "Technical document", label: "Technical document" }
    ];

    const scaleTypeOptions = [
        { value: "blueprints / effects", label: "blueprints / effects" },
        { value: "1:1,000", label: "1:1,000" },
        { value: "1:7,500", label: "1:7,500" },
        { value: "1:8,000", label: "1:8,000" },
        { value: "1:12,000", label: "1:12,000" },
        { value: "Text", label: "Text" }
    ];

    const [title, setTitle] = useState("")
    const [stakeholders, setStakeholders] = useState(null)
    const [scale, setScale] = useState(null)
    const [issuanceDate, setIssuanceDate] = useState(new Date().toISOString().split('T')[0])
    const [docType, setDocType] = useState(null)
    const [numPages, setNumPages] = useState(0)
    const [connections, setConnections] = useState<Connection[]>([])
    const [language, setLanguage] = useState("")
    const [description, setDescription] = useState("")
    const [modalOpen, setModalOpen] = useState(false);

    const modalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '700px',
        }
    }

    const handleAddConnection = (connection: Connection) => {
        setModalOpen(false);
        setConnections([...connections, connection]);
        console.log(connections)
    }

    const handleDeleteConnection = (index: number) => {
        const newConnections = connections.filter((_, i) => i !== index);
        setConnections(newConnections);
    };   

    const handleEditConnection = (index : any, newConnection : Connection) => {
        const newConnections = connections.map((connection, i) => i === index ? newConnection : connection)
        setConnections(newConnections)
    };

    return (
        <>
            <div className="flex flex-col items-center p-8 min-h-screen w-full">
                <div className="w-full max-w-[900px] rounded shadow-md border">
                    <h2 className="text-center text-2xl font-bold mt-6">Create a new document</h2>
                    <form className="m-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-x-4 gap-y-3">
                           
                            {/* Grid one */}
                            <div className="col-span-1 row-span-1 col-start-1 row-start-1">

                                {/* Title */}
                                <div className="my-4">
                                    <label className="mr-1 font-semibold">Title</label>
                                    <span className="text-red-600">*</span>
                                    <input className="focus:outline-none p-2 bg-white border block w-full rounded mt-2"
                                        type="text"
                                        value={title}
                                        onChange={({target}) => setTitle(target.value)}
                                    />
                                </div>

                                {/* Stakeholders */}
                                <div className="my-4">
                                    <label className="mr-1 font-semibold">Stakeholders</label>
                                    <span className="text-red-600">*</span>
                                    <Select
                                    defaultValue={stakeholders}
                                    onChange={setStakeholders}
                                    options={stakeholdersOptions}
                                    className="mt-2"
                                    placeholder="Select stakeholders..."
                                    />
                                </div>

                                {/* Scale of document */}
                                <div className="my-4">
                                    <label className="mr-1 font-semibold">Scale</label>
                                    <span className="text-red-600">*</span>
                                    <Select
                                    defaultValue={scale}
                                    onChange={setScale}
                                    options={scaleTypeOptions}
                                    className="mt-2"
                                    placeholder="Select scale..."
                                    />
                                </div>

                                {/* Issuance date of document */}
                                <div className="mt-4">
                                    <label className="mr-1 font-semibold">Issuance date</label>
                                    <span className="text-red-600">*</span>
                                    <input className="block p-2 border rounded w-full mt-2 focus:outline-none" 
                                        type="date" max={new Date().toISOString().split('T')[0]}
                                        value={issuanceDate} onChange={setIssuanceDate} />
                                </div> 
                            </div>

                            {/* Grid two */}
                            <div className="col-span-1 row-span-1 col-start-2 row-start-1">

                                {/* Description */}
                                <div className="my-4">
                                    <label htmlFor="desc" className="mr-1 font-semibold">Description</label>
                                    <span className="text-red-600">*</span>
                                    <textarea id="desc" value={description} onChange={({target}) => setDescription(target.value)}
                                        className="block w-full border h-32 mt-2 p-2 resize-none rounded focus:outline-none" 
                                        maxLength="1000" />
                                </div>
                
                                {/* Language */}
                                <div className="my-4">
                                    <label className="mr-1 font-semibold">Language</label>
                                    <input className="focus:outline-none p-2 bg-white border block w-full rounded mt-2"
                                        type="text"
                                        value={language}
                                        onChange={({target}) => setLanguage(target.value)}
                                    />
                                </div>

                                {/* Number of pages */}
                                <div className="mt-4">
                                    <label htmlFor="number" className="mr-1 font-semibold">Page</label>
                                    <input id="number" className="focus:outline-none p-2 bg-white border block w-full rounded mt-2"
                                        type="number"
                                        min="0"
                                        value={numPages}
                                        onChange={({target}) => setNumPages(parseInt(target.value))}
                                    />
                                </div>
                            </div>

                            <div className="col-span-2 row-span-1 col-start-1 row-start-2 md:text-center mt-5">
                                {/* Type of document */}
                                <div className="">
                                    <label className="mr-1 font-semibold">Type</label>
                                    <span className="text-red-600">*</span>
                                    <Select placeholder="Select document type..."
                                        defaultValue={docType}
                                        onChange={setDocType}
                                        options={documentTypeOptions}
                                        className="mt-2 max-w-[500px] md:mx-auto" />
                                </div>

                                <div className="my-2">
                                    <label className="font-semibold">Connections</label>

                                    {
                                        connections?.length === 0 ?
                                        <h1 className="mt-2 text-gray-500">No connections yet</h1> : connections?.length > 0 &&
                                        <ConnectionList connections={connections} handleDelete={handleDeleteConnection} handleEdit={handleEditConnection} handleAddConnection={handleAddConnection} />
                                    }

                                    <div onClick={() => setModalOpen(true)} className="flex items-center justify-center max-w-[100px] h-10 rounded md:mx-auto border border-dashed border-blue-500 group hover:bg-blue-500 cursor-pointer my-2">
                                        <FaPlus size={18} className="text-blue-500 group-hover:text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <Modal style={modalStyles} isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
                <div className="relative">
                    <button onClick={() => setModalOpen(false)} className="absolute top-0 right-0 p-2 text-xl text-gray-500 hover:text-gray-700">
                        &times;
                    </button>

                    <ConnectionForm setModalOpen={setModalOpen} handleAddConnection={handleAddConnection} />
                </div>
            </Modal>
        </>
    );
};

export default DocumentForm;
