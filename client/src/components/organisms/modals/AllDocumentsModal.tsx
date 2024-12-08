import React, { useEffect, useState } from 'react';
import { IDocument } from '../../../utils/interfaces/document.interface';
import { DocumentItem } from '../../molecules/documentsItems/DocumentItem';
import Searchbar from '../../molecules/Searchbar';
import Filters from '../../molecules/filters/Filters';
import API from '../../../API';
import Toast from '../Toast';
import useToast from '../../../utils/hooks/toast';

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
  const [filters, setFilters] = useState<{
    type: string;
    stakeholders: string[];
    coordinates: string;
    year: string;
    month: string;
    day: string;
    language: string;
    scale: string;
    architecturalScale: string;
  }>({
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
  const [filteredDocuments, setFilteredDocuments] = useState<IDocument[]>([]);

  const {toast, showToast, hideToast} = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      const documents = await API.getDocuments();
      setFilteredDocuments(documents);
    }
    fetchDocuments();
  }, []);

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
        
        <Searchbar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          filters={filters}
          setFilteredDocuments={setFilteredDocuments}
          showToast={showToast}
        />
        
        <div>
          {
            filteredDocuments.length === 0 ? <h1 className='text-sm text-gray-400'>No documents</h1> :
            filteredDocuments.map((doc) => (
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