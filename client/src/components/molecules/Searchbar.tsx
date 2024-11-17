import React from 'react';

interface SearchbarProps {
    searchQuery: string;
    setSearchQuery: (searchQuery: string) => void;
}

const Searchbar : React.FC<SearchbarProps> = ({
    searchQuery,
    setSearchQuery
}) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }

    return (
        <div className='my-4 w-full flex items-center justify-between gap-x-1'>
            <input value={searchQuery} onChange={handleInputChange} type="search" placeholder="Search for documents..."
            className="outline-none px-3 py-2 w-4/5 border rounded bg-white" />
            <button className="bg-black text-white font-bold px-2 py-2 w-1/5 rounded">Search</button>
        </div>
    );
};

export default Searchbar;