import React, { useEffect, useState } from 'react';
import { IDocument } from '../../utils/interfaces/document.interface';
import { DocumentItem } from '../molecules/documentsItems/DocumentItem';
import Searchbar from '../molecules/Searchbar';
import Filters from '../molecules/filters/Filters';
import API from '../../API';
import Toast from './Toast';
import useToast from '../../utils/hooks/toast';

interface AllDocumentsListProps {
  filteredDocuments: IDocument[];
  setFilteredDocuments: (documents: IDocument[]) => void;
}

const AllDocumentsList: React.FC<AllDocumentsListProps> = ({
  filteredDocuments,
  setFilteredDocuments
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
      <div className='flex flex-col mt-14'>
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

export default AllDocumentsList;