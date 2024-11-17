import React, { useState } from 'react';
import { IDocument } from '../../../utils/interfaces/document.interface';
import { DocumentItem } from '../../molecules/documentsItems/DocumentItem';
import Searchbar from '../../molecules/Searchbar';
import InputComponent from '../../atoms/input/input';

interface AllDocumentsModalProps {
    setShowAllDocuments: (showAllDocuments: boolean) => void;
    documents: IDocument[];
}

const AllDocumentsModal: React.FC<AllDocumentsModalProps> = ({
    setShowAllDocuments,
    documents
}) => {

    const [filters, setFilters] = useState({
        type: '',
        scale: '',
        stakeholders: '',
        language: ''
    })

    const [searchQuery, setSearchQuery] = useState('');

    const documentTypeOptions = [
        {
          value: 'AGREEMENT',
          label: 'Agreement',
        },
        {
          value: 'CONFLICT',
          label: 'Conflict',
        },
        {
          value: 'CONSULTATION',
          label: 'Consultation',
        },
        {
          value: 'DESIGN_DOC',
          label: 'Design document',
        },
        {
          value: 'INFORMATIVE_DOC',
          label: 'Informative document',
        },
        {
          value: 'MATERIAL_EFFECTS',
          label: 'Material effects',
        },
        {
          value: 'PRESCRIPTIVE_DOC',
          label: 'Prescriptive document',
        },
        {
          value: 'TECHNICAL_DOC',
          label: 'Technical document',
        },
    ];

    return (
        <div className='flex flex-col'>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-bold'>All Documents</h1>
                <button onClick={()=>setShowAllDocuments(false)}
                className='bg-black text-white font-semibold px-2 rounded'>Close</button>
            </div>

            <h2 className='text-xl'>Filters</h2>
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
                {/* Filter by Type */}
                <InputComponent
                    label="Type"
                    type="select"
                    options={documentTypeOptions}
                    value={filters.type}
                    onChange={(e) => {
                        if ('target' in e) {
                            setfilters({...filters, type: e.target.value});
                        }
                    }}
                    required={false}/>
                
                {/* Filter by Scale */}
                <InputComponent
                    label="Scale"
                    type="text"
                    value={filters.scale}
                    onChange={(e) => {
                        if ('target' in e) {
                            setFilters({...filters, scale: e.target.value});
                        }
                    }}
                    required={false}
                    placeholder="Enter scale..."/>
                
                {/* Filter by Stakeholders */}
                <InputComponent
                    label="Stakeholders"
                    type="text"
                    value={filters.stakeholders}
                    onChange={(e) => {
                        if ('target' in e) {
                            setFilters({...filters, stakeholders: e.target.value});
                        }
                    }}
                    required={false}
                    placeholder="Enter stakeholders..."/>

                {/* Filter by Language */}
                <InputComponent
                    label="Language"
                    type="text"
                    value={filters.language}
                    onChange={(e) => {
                        if ('target' in e) {
                            setFilters({...filters, language: e.target.value});
                        }
                    }}
                    required={false}
                    placeholder="Enter language..."/>
            </div>
            
            <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            
            <div className=''>
                {documents.map((doc, index) => (
                <DocumentItem key={index} document={doc} />
                ))}
            </div>
        </div>  
    )
}

export default AllDocumentsModal;