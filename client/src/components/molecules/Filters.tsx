import React, { useState, useEffect } from 'react';
import InputComponent from '../atoms/input/input';
import { stakeholderOptions } from '../../shared/stakeholder.options.const';
import { documentTypeOptions } from '../../shared/type.options.const';
import { scaleOptions } from '../../shared/scale.options.const';
import { years, months, getDays } from '../../utils/date';
import API from '../../API';
import { Tabs, Tab, Box } from '@mui/material';

interface FiltersProps {
    filters: {
        type: string,
        stakeholders: string[],
        coordinates: string,
        year: string,
        month: string,
        day: string,
        language: string,
        scale: string,
        architecturalScale: string,
    };
    setFilters: (
        filters: { 
            type: string, 
            stakeholders: string[],
            coordinates: string,
            year: string,
            month: string,
            day: string,
            language: string,
            scale: string,
            architecturalScale: string,
    }) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
    const [coordinatesOptions, setCoordinatesOptions] = useState([]);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        API.getCoordinates().then((coordinates) => {
            setCoordinatesOptions(coordinates.map((coordinate: any) => ({ value: coordinate._id, label: coordinate.name })));
        });
    }, []);

    const handleFilterChange = (key: any, value: any) => {
        if (key === 'stakeholders') {
            setFilters({ ...filters, stakeholders: [...filters.stakeholders, value] });
            return;
        }
        setFilters({ ...filters, [key]: value });
    }

    const renderGeneralFilters = () => {
        return (
            <Box className="grid grid-cols-3 gap-4">
                <InputComponent label="Type"
                    type="select"
                    options={documentTypeOptions}
                    value={filters.type}
                    onChange={(e) => {
                        if ('target' in e) {
                            handleFilterChange('type', e.target.value);
                        }
                    }}
                    required={false}
                />
                
                <InputComponent label="Stakeholder(s)" 
                    type="multi-select"
                    options={stakeholderOptions}
                    required={false} 
                    placeholder="Enter stakeholders..."
                    value={filters.stakeholders.map((stakeholder) => ({ value: stakeholder, label: stakeholder }))}
                    onChange={(e) => {
                        setFilters(
                            e 
                            ? (() => {
                                if(Array.isArray(e)) {
                                    return { ...filters, stakeholders: e.map((option) => option.value) };
                                }
                                else {
                                    return { ...filters, stakeholders: [] };
                                }
                            })()
                            : {...filters, stakeholders: []},
                        );
                    }}
                />

                <InputComponent label="Area / Points"
                    type="select"
                    required={false}
                    value={filters.coordinates}
                    onChange={(e) => {
                        if ('target' in e) {
                            handleFilterChange('coordinates', e.target.value);
                        }
                    }}
                    options={coordinatesOptions}
                    placeholder="Area & Points"
                />
            </Box>
        )
    };

    const renderDateFilters = () => {
        return (
            <Box className="grid grid-cols-3 gap-4">
                <InputComponent label="Year" type="select" required={false}
                    value={filters.year}
                    onChange={(e) => {
                        if ('target' in e) {
                            handleFilterChange('year', e.target.value);
                        }
                    }}
                    options={years.map((year) => ({ value: year, label: year }))}
                    placeholder="Year"
                />

                <InputComponent label="Month"
                    type="select"
                    required={false}
                    value={filters.month}
                    onChange={(e) => {
                        if ('target' in e) {
                            handleFilterChange('month', e.target.value);
                        }
                    }}
                    options={months.map((month) => ({ value: month, label: month }))}
                    placeholder="Month"
                />

                <InputComponent label="Day"
                    type="select"
                    required={false}
                    placeholder='Enter day...'
                    value={filters.day}
                    onChange={(e) => {
                        if ('target' in e) {
                            handleFilterChange('day', e.target.value);
                        }
                    }}
                    options={getDays(filters.year, filters.month).map((day) => ({ value: day, label: day }))}
                />
            </Box>
        )
    };

    const renderAdditionalFilters = () => {
        return (
            <Box className="grid grid-cols-3 gap-4">
                <InputComponent label="Language"
                    type="text"
                    required={false}
                    value={filters.language}
                    onChange={(e) => {
                        if ('target' in e) {
                            handleFilterChange('language', e.target.value);
                        }
                    }}
                    placeholder="Language"
                />

                <div className="col-span-2 grid grid-cols-2 gap-2">
                    <div className={filters.scale !== 'ARCHITECTURAL' ? 'col-span-2' : 'col-span-1'}>
                        <InputComponent 
                            label="Scale type"
                            type="select" options={scaleOptions}
                            value={filters.scale} onChange={(e) => {
                                if ('target' in e) {
                                    handleFilterChange('scale', e.target.value);
                                }
                            }}
                        />
                    </div>
                    

                    {/* Custom Scale Input */}
                    {filters.scale === 'ARCHITECTURAL' &&
                        <div className="col-span-1">
                            <InputComponent
                                label="Custom Scale"
                                type="text"
                                value={filters.architecturalScale}
                                onChange={(v) => {
                                    if ('target' in v) {
                                        handleFilterChange('architecturalScale', v.target.value);
                                    }
                                }}
                                required={false}
                                placeholder="Enter custom scale"
                            />
                        </div>
                    }
                </div>
            </Box>
        )
    };

    return (
        <Box className="p-4">
            {/* Tabs Navigation */}
            <Tabs value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            textColor="black"
            indicatorColor="black"
            variant="fullWidth"
            centered
            sx={{
                '& .MuiTab-root': { color: 'black' }, // Tab text color
                '& .Mui-selected': { color: 'black', fontWeight: 'bold' }, // Selected tab text
                '& .MuiTabs-indicator': { backgroundColor: 'black' }, // Indicator color
            }}
            >
                <Tab label="General" />
                <Tab label="Date" />
                <Tab label="Additional" />
            </Tabs>

            {/* Tabs Content */}
            <Box className="mt-4">
                {activeTab === 0 && renderGeneralFilters()}
                {activeTab === 1 && renderDateFilters()}
                {activeTab === 2 && renderAdditionalFilters()}
            </Box>
        </Box>
    )
}

export default Filters;