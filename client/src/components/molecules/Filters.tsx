import React from 'react';
import InputComponent from '../atoms/input/input';

interface FiltersProps {
    filters: {
        type: string,
        scale: string,
        stakeholders: string,
        language: string
    };
    setFilters: (
        filters: { 
            type: string, 
            scale: string, 
            stakeholders: string, 
            language: string 
    }) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
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
        <>
            {/* Filter by Type */}
            <InputComponent
            label="Type"
            type="select"
            options={documentTypeOptions}
            value={filters.type}
            onChange={(e) => {
                if ('target' in e) {
                    setFilters({...filters, type: e.target.value});
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
        </>
    )
}

export default Filters;