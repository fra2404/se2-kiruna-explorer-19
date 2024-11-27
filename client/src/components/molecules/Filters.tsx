import React from 'react';
import InputComponent from '../atoms/input/input';

interface FiltersProps {
    filters: {
        type: string,
        stakeholders: string,
        area: string,
        year: string,
        month: string,
        day: string
    };
    setFilters: (
        filters: { 
            type: string, 
            stakeholders: string,
            area: string,
            year: string,
            month: string,
            day: string
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
        <div className="grid grid-cols-3 grid-rows-2 gap-x-3">
            {/* Filter by Type */}
            <InputComponent label="Type"
                type="select"
                options={documentTypeOptions}
                value={filters.type}
                onChange={(e) => {
                    if ('target' in e) {
                        setFilters({...filters, type: e.target.value});
                    }
                }}
                required={false}
            />
            
            {/* Filter by Stakeholders */}
            <InputComponent label="Stakeholders" 
                type="select"
                required={false} 
                placeholder="Enter stakeholders..."
                value={filters.stakeholders}
                onChange={(e) => {
                    if ('target' in e) {
                        setFilters({...filters, stakeholders: e.target.value});
                    }
                }}
            />

            {/* Filter by Area */}
            <InputComponent label="Area"
                type="select"
                required={false}
                value={filters.area}
                onChange={(e) => {
                    if ('target' in e) {
                        setFilters({...filters, area: e.target.value});
                    }
                }}
            />

            {/* Filter by Date */}
            <div className='col-span-3 grid grid-cols-3 gap-x-3'>

                {/* Year */}
                <InputComponent label="Year"
                    type="select"
                    required={false}
                    value={filters.year}
                    onChange={(e) => {
                        if ('target' in e) {
                            setFilters({...filters, year: e.target.value});
                        }
                    }}
                />

                {/* Month */}
                <InputComponent label="Month"
                    type="select"
                    required={false}
                    value={filters.month}
                    onChange={(e) => {
                        if ('target' in e) {
                            setFilters({...filters, month: e.target.value});
                        }
                    }}
                />

                {/* Day */}
                <InputComponent label="Day"
                    type="text"
                    required={false}
                    placeholder='Enter day...'
                    value={filters.day}
                    onChange={(e) => {
                        if ('target' in e) {
                            setFilters({...filters, day: e.target.value});
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default Filters;