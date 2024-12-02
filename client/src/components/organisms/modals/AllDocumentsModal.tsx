import React, { useEffect, useState } from 'react';
import { IDocument } from '../../../utils/interfaces/document.interface';
import { DocumentItem } from '../../molecules/documentsItems/DocumentItem';
import Searchbar from '../../molecules/Searchbar';
import Filters from '../../molecules/Filters';
import API from '../../../API';
import Toast from '../Toast';
import useToast from '../../../utils/hooks/toast';

interface AllDocumentsModalProps {
  setShowAllDocuments: (showAllDocuments: boolean) => void;
  coordinates: any;
  setCoordinates: (coordinates: any) => void;
  allDocuments: IDocument[];
  setAllDocuments: (documents: IDocument[]) => void;
}

const AllDocumentsModal: React.FC<AllDocumentsModalProps> = ({
    setShowAllDocuments,
    coordinates,
    setCoordinates,
    allDocuments,
    setAllDocuments
}) => {

    const [filters, setFilters] = useState({
        type: '',
        stakeholders: '',
        area: '',
        year: '',
        month: '',
        day: '',
        language: '',
        scale: '',
        customScale: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [documents, setDocuments] = useState<IDocument[]>([]);
    const { toast, showToast, hideToast } = useToast();

    useEffect(() => {
        const fetchDocuments = async () => {
            const documents = await API.getDocuments();
            setDocuments(documents);
        }
        fetchDocuments();
    }, []);

    const handleSearch = async () => {
        if (
            filters.scale === 'ARCHITECTURAL' &&
            ((filters.customScale ?? '').trim() === '' ||
              !/^1:\d+$/.test(filters.customScale ?? ''))
          ) {
            showToast('Invalid architectural scale', 'error');
            return;
          }
        const documents = await API.searchDocuments(searchQuery, filters);
        setDocuments(documents);
    };

    return (
        <>
            <div className='flex flex-col'>
                <div className='flex justify-between'>
                    <h1 className='text-2xl font-bold'>All Documents</h1>
                    <button onClick={()=>setShowAllDocuments(false)}
                    className='bg-black text-white font-semibold px-2 rounded'>Close</button>
                </div>

                <h2 className='text-xl'>Filters</h2>            
                <Filters filters={filters} setFilters={setFilters} />
                
                <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                handleSearch={handleSearch} />
                
                <div>
                    {
                        documents.length === 0 ? <h1 className='text-sm text-gray-400'>No documents</h1> :
                        documents.map((doc) => (
                        <DocumentItem 
                            key={doc.id}
                            document={doc} 
                            coordinates={coordinates}
                            setCoordinates={setCoordinates}
                            allDocuments={allDocuments}
                            setDocuments={setAllDocuments}
                        />
                        ))
                    }
                </div>
            </div> 
            
            {
                toast.isShown && (
                    <Toast isShown={toast.isShown} message={toast.message} 
                        type={toast.type} onClose={hideToast}
                    />
                )
            }
        </>
    )
}

export default AllDocumentsModal;