import React, { useEffect, useState } from 'react';
import { IDocument } from '../../../utils/interfaces/document.interface';
import { DocumentItem } from '../../molecules/documentsItems/DocumentItem';
import Searchbar from '../../molecules/Searchbar';
import Filters from '../../molecules/Filters';
import API from '../../../API';
import Toast from '../Toast';
import useToast from '../../../utils/hooks/toast';
import mongoose from 'mongoose';

interface AllDocumentsModalProps {
    setShowAllDocumentsModal: (showAllDocumentsModal: boolean) => void;
    coordinates: any;
    setCoordinates: (coordinates: any) => void;
    allDocuments: IDocument[];
    setAllDocuments: (allDocuments: IDocument[]) => void;
}

const AllDocumentsModal: React.FC<AllDocumentsModalProps> = ({
    setShowAllDocumentsModal,
    coordinates,
    setCoordinates,
    allDocuments,
    setAllDocuments,
}) => {

    const [filters, setFilters] = useState({
        type: '',
        stakeholders: [],
        coordinates: '',
        year: '',
        month: '',
        day: '',
        language: '',
        scale: '',
        architecturalScale: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [documents, setDocuments] = useState<IDocument[]>([]);
    const { toast, showToast, hideToast } = useToast();
    const [date, setDate] = useState('');

    useEffect(() => {
        const fetchDocuments = async () => {
            const documents = await API.getDocuments();
            setDocuments(documents);
        }
        fetchDocuments();
    }, []);

    useEffect(() => {
        if (filters.year && filters.month && filters.day) {
            setDate(`${filters.year}-${filters.month}-${filters.day}`);
        } else if (filters.year && filters.month) {
            setDate(`${filters.year}-${filters.month}`);
        } else if (filters.year) {
            setDate(filters.year);
        } else {
            setDate('');
        }
    }, [filters.year, filters.month, filters.day, setDate]);

    const isNotValidateArchitecturalScale = () => {
        return (
            filters.scale === 'ARCHITECTURAL' &&
            ((filters.architecturalScale ?? '').trim() === '' ||
              !/^1:\d+$/.test(filters.architecturalScale ?? ''))
        );
    }

    const isValidateCoordinates = () => {
        return filters.coordinates === "" || mongoose.Types.ObjectId.isValid(filters.coordinates);
    };

    const handleSearch = async () => {
        if (isNotValidateArchitecturalScale()) {
            showToast('Invalid architectural scale', 'error');
            return;
        }
        if (!isValidateCoordinates()) {
            showToast('Invalid coordinates', 'error');
            return;
        }
        let wellFormedFilters = {
            type: filters.type,
            stakeholders: filters.stakeholders,
            coordinates: filters.coordinates,
            date,
            language: filters.language,
            scale: filters.scale,
            architecturalScale: filters.architecturalScale,
        };
        const documents = await API.searchDocuments(searchQuery, wellFormedFilters);
        setDocuments(documents);
    };

    return (
        <>
            <div className='flex flex-col'>
                <div className='flex justify-between'>
                    <h1 className='text-2xl font-bold'>All Documents</h1>
                    <button onClick={()=>setShowAllDocumentsModal(false)}
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