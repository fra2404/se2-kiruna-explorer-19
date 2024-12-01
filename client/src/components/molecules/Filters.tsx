import React, { useState, useEffect } from 'react';
import InputComponent from '../atoms/input/input';
import { stakeholderOptions } from '../../shared/stakeholder.options.const';
import { documentTypeOptions } from '../../shared/type.options.const';
import { years, months, getDays } from '../../utils/date';
import API from '../../API';

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

    const [areasOptions, setAreasOptions] = useState([]);

    useEffect(() => {
        API.getAreas().then((areas) => {
            setAreasOptions(areas.map((area : any) => ({ value: area.id, label: area.name })));
        });
    }, []);

    return (
        <div className="grid grid-cols-3 grid-rows-auto gap-x-3">
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
                type="multi-select"
                options={stakeholderOptions}
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
                options={areasOptions}
                placeholder="Area"
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
                    options={years.map((year) => ({ value: year, label: year }))}
                    placeholder="Year"
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
                    options={months.map((month) => ({ value: month, label: month }))}
                    placeholder="Month"
                />

                {/* Day */}
                <InputComponent label="Day"
                    type="select"
                    required={false}
                    placeholder='Enter day...'
                    value={filters.day}
                    onChange={(e) => {
                        if ('target' in e) {
                            setFilters({...filters, day: e.target.value});
                        }
                    }}
                    options={getDays(filters.year, filters.month).map((day) => ({ value: day, label: day }))}
                />
            </div>
        </div>
    )
}

export default Filters;