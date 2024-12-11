import React, { useState, useEffect } from 'react';
import InputComponent from '../../atoms/input/input';
import './Step1.css';
import { stakeholderOptions as initialStakeholderOptions } from '../../../shared/stakeholder.options.const';
import { scaleOptions } from '../../../shared/scale.options.const';
import { years, months, getDays } from '../../../utils/date';

interface Step1Props {
  title: string;
  setTitle: (value: string) => void;
  stakeholders: string[];
  setStakeholders: (value: string[]) => void;
  scale: string;
  setScale: (value: string) => void;
  issuanceDate: string;
  setIssuanceDate: (value: string) => void;
  architecturalScale: string;
  setArchitecturalScale: (value: string) => void;
  errors: { [key: string]: string };
}

const Step1: React.FC<Step1Props> = ({
  title,
  setTitle,
  stakeholders,
  setStakeholders,
  scale,
  setScale,
  issuanceDate,
  setIssuanceDate,
  architecturalScale,
  setArchitecturalScale,
  errors,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>(
    issuanceDate ? issuanceDate.split('-')[0] : '',
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    issuanceDate ? issuanceDate.split('-')[1] : '',
  );
  const [selectedDay, setSelectedDay] = useState<string>(
    issuanceDate ? issuanceDate.split('-')[2] : '',
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stakeholderOptions, setStakeholderOptions] = useState(initialStakeholderOptions);

  useEffect(() => {
    if (issuanceDate) {
      const [year, month, day] = issuanceDate.split('-');
      setSelectedYear(year || '');
      setSelectedMonth(month || '');
      setSelectedDay(day || '');
    }
  }, [issuanceDate]);

  useEffect(() => {
    if (selectedYear && selectedMonth && selectedDay) {
      setIssuanceDate(`${selectedYear}-${selectedMonth}-${selectedDay}`);
    } else if (selectedYear && selectedMonth) {
      setIssuanceDate(`${selectedYear}-${selectedMonth}`);
    } else if (selectedYear) {
      setIssuanceDate(selectedYear);
    } else {
      setIssuanceDate('');
    }
  }, [selectedYear, selectedMonth, selectedDay, setIssuanceDate]);

  useEffect(() => {
    if (!selectedMonth) {
      setSelectedDay('');
    }
  }, [selectedMonth]);

  const handleSaveNewStakeholder = (newStakeholder: { value: string; label: string }) => {
    setStakeholderOptions([...stakeholderOptions, newStakeholder]);
    setStakeholders([...stakeholders, newStakeholder.value]);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Title */}
      <div className="my-2">
        <InputComponent
          label="Title"
          type="text"
          value={title}
          onChange={(v) => {
            if ('target' in v) {
              setTitle(v.target.value);
            }
          }}
          required={true}
          placeholder="Enter title"
          error={errors.title}
        />
      </div>

      {/* Stakeholders */}
      <div className="my-2">
        <InputComponent
          label="Stakeholder(s)"
          type="multi-select"
          options={stakeholderOptions}
          value={stakeholders.map((stakeholder) => ({
            value: stakeholder,
            label: stakeholder,
          }))}
          onChange={(selectedOptions) => {
            setStakeholders(
              selectedOptions
                ? (() => {
                    if (Array.isArray(selectedOptions)) {
                      return selectedOptions.map((option) => option.value);
                    } else {
                      return [];
                    }
                  })()
                : [],
            );
          }}
          required={true}
          placeholder="Select stakeholder(s)"
          error={errors.stakeholders}
          addNew={true}
          onAddNew={() => setIsModalOpen(true)}
        />
      </div>

      {/* Scale of document */}
      <div
        className={`my-2 ${scale === 'ARCHITECTURAL' ? 'inline-fields' : ''}`}
      >
        <InputComponent
          label="Scale"
          type="select"
          options={scaleOptions}
          value={{ value: scale, label: scale }}
          onChange={(e) => {
            if ('target' in e) {
              const selectedOption = e.target.value;
              setScale(selectedOption);
            }
          }}
          required={true}
          defaultValue={scale}
          placeholder="Select scale"
          error={errors.scale}
        />

        {/* Custom Scale Input */}
        {scale === 'ARCHITECTURAL' && (
          <InputComponent
            label="Custom Scale"
            type="text"
            value={architecturalScale}
            onChange={(v) => {
              if ('target' in v) {
                setArchitecturalScale(v.target.value);
              }
            }}
            required={true}
            defaultValue={architecturalScale}
            placeholder="Enter custom scale"
            error={errors.architecturalScale}
          />
        )}
      </div>

      {/* Issuance date of document */}
      <div className="my-2">
        <label htmlFor="issuance-date-year" className="font-bold text-sm">
          Issuance date <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-2">
          <InputComponent
            label="Year"
            type="select"
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(
                (e as React.ChangeEvent<HTMLSelectElement>).target.value,
              )
            }
            required
            defaultValue={selectedYear}
            options={years.map((year) => ({ value: year, label: year }))}
            placeholder="Year"
            error={errors.issuanceDate}
          />
          <InputComponent
            label="Month"
            type="select"
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(
                (e as React.ChangeEvent<HTMLSelectElement>).target.value,
              )
            }
            disabled={!selectedYear}
            defaultValue={selectedMonth}
            options={months.map((month) => ({ value: month, label: month }))}
            placeholder="Month"
          />
          <InputComponent
            label="Day"
            type="select"
            value={selectedDay}
            defaultValue={selectedDay}
            onChange={(e) =>
              setSelectedDay(
                (e as React.ChangeEvent<HTMLSelectElement>).target.value,
              )
            }
            disabled={!selectedYear || !selectedMonth}
            options={getDays(selectedYear, selectedMonth).map((day) => ({ value: day, label: day }))}
            placeholder="Day"
          />
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} onSave={handleSaveNewStakeholder} />
      )}
    </>
  );
};

const Modal: React.FC<{ onClose: () => void; onSave: (newStakeholder: { value: string; label: string }) => void }> = ({ onClose, onSave }) => {
  const [newStakeholder, setNewStakeholder] = useState<{ value: string; label: string }>({ value: '', label: '' });

  const handleSave = () => {
    onSave(newStakeholder);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Add New Stakeholder</h2>
        <input
          type="text"
          placeholder="Label"
          value={newStakeholder.label}
          onChange={(e) => setNewStakeholder({ ...newStakeholder, label: e.target.value })}
          className="border p-2 mb-4 w-full"
        />
        <input
          type="text"
          placeholder="Value"
          value={newStakeholder.value}
          onChange={(e) => setNewStakeholder({ ...newStakeholder, value: e.target.value })}
          className="border p-2 mb-4 w-full"
        />
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default Step1;