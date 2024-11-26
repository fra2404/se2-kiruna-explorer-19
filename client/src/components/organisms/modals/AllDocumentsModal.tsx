import React, { useEffect, useState } from 'react';
import { IDocument } from '../../../utils/interfaces/document.interface';
import { DocumentItem } from '../../molecules/documentsItems/DocumentItem';
import Searchbar from '../../molecules/Searchbar';
import Filters from '../../molecules/Filters';
import API from '../../../API';

interface AllDocumentsModalProps {
    setShowAllDocuments: (showAllDocuments: boolean) => void;
}

const AllDocumentsModal: React.FC<AllDocumentsModalProps> = ({
    setShowAllDocuments,
}) => {

    const [filters, setFilters] = useState({
        type: '',
        scale: '',
        stakeholders: '',
        language: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [documents, setDocuments] = useState<IDocument[]>([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            const documents = await API.getDocuments();
            setDocuments(documents);
        }
        fetchDocuments();
    }, []);

    const handleSearch = async () => {
        const documents = await API.searchDocuments(searchQuery, filters);
        setDocuments(documents);
    };

    return (
        <div className='flex flex-col'>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-bold'>All Documents</h1>
                <button onClick={()=>setShowAllDocuments(false)}
                className='bg-black text-white font-semibold px-2 rounded'>Close</button>
            </div>

            <h2 className='text-xl'>Filters</h2>
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
                <Filters filters={filters} setFilters={setFilters} />
            </div>
            
            <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            handleSearch={handleSearch} />
            
            <div className=''>
                {
                    documents.length === 0 ? <h1 className='text-sm text-gray-400'>No documents</h1> :
                    documents.map((doc) => (
                      <DocumentItem key={doc.id} document={doc} />
                    ))
                }
            </div>
        </div>  
    )
}

export default AllDocumentsModal;