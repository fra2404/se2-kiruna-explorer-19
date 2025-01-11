import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { IDocument } from '../../utils/interfaces/document.interface';
import { handleSearch } from './filters/handleSearch';

interface SearchbarProps {
    searchQuery: string;
    setSearchQuery: (searchQuery: string) => void;
    filters: {
      type: string;
      stakeholders: string[];
      coordinates: string;
      year: string;
      month: string;
      day: string;
      language: string;
      scale: string;
      architecturalScale: string;
    };
    setFilteredDocuments: (documents: IDocument[]) => void;
    showToast: (message: string, type: 'success' | 'error') => void
}

const Searchbar : React.FC<SearchbarProps> = ({
    searchQuery,
    setSearchQuery,
    filters,
    setFilteredDocuments,
    showToast
}) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }

    return (
        <div className='my-4 w-full flex items-center justify-between gap-x-1 px-2'>
            <input value={searchQuery} onChange={handleInputChange} type="search" placeholder="Search for documents..."
            className="outline-none px-3 py-2 w-[90%] border rounded bg-white" />
            <button onClick={() => {handleSearch(filters, searchQuery, setFilteredDocuments, showToast)}}
            className="bg-black text-white font-bold px-2 py-2 w-[10%] rounded flex justify-center">
                <FaSearch className='text-xl' />
            </button>
        </div>
    );
};

export default Searchbar;