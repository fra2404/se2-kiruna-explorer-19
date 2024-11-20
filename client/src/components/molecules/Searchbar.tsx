import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchbarProps {
    searchQuery: string;
    setSearchQuery: (searchQuery: string) => void;
    handleSearch: () => void;
}

const Searchbar : React.FC<SearchbarProps> = ({
    searchQuery,
    setSearchQuery,
    handleSearch
}) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }

    return (
        <div className='my-4 w-full flex items-center justify-between gap-x-1'>
            <input value={searchQuery} onChange={handleInputChange} type="search" placeholder="Search for documents..."
            className="outline-none px-3 py-2 w-[90%] border rounded bg-white" />
            <button onClick={handleSearch}
            className="bg-black text-white font-bold px-2 py-2 w-[10%] rounded flex justify-center">
                <FaSearch className='text-xl' />
            </button>
        </div>
    );
};

export default Searchbar;