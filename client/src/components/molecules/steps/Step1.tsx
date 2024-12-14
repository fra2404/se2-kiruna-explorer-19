import React, { useState, useEffect, useRef } from 'react';
import InputComponent from '../../atoms/input/input';
import './Step1.css';
import { stakeholderOptions as initialStakeholderOptions } from '../../../shared/stakeholder.options.const';
import { scaleOptions } from '../../../shared/scale.options.const';
import { years, months, getDays } from '../../../utils/date';
import { FaCheck } from 'react-icons/fa';
import ButtonRounded from '../../atoms/button/ButtonRounded';

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
  const [stakeholderOptions, setStakeholderOptions] = useState(initialStakeholderOptions);
  const [isAddingNewStakeholder, setIsAddingNewStakeholder] = useState(false);
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [inputKey, setInputKey] = useState(0); // Aggiungi uno stato per la chiave dinamica
  const newStakeholderInputRef = useRef<HTMLInputElement>(null); // Crea un riferimento per il campo di input

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

  useEffect(() => {
    if (isAddingNewStakeholder && newStakeholderInputRef.current) {
      newStakeholderInputRef.current.focus(); // Imposta il focus sul campo di input
    }
  }, [isAddingNewStakeholder]);

  const handleSaveNewStakeholder = (newStakeholder: { value: string; label: string }) => {
    const newOption = { value: newOptionLabel, label: newOptionLabel };
    setStakeholderOptions([...stakeholderOptions, newOption]);
    const updatedStakeholders = [...stakeholders, newOption.value];
    console.log('Stakeholders selezionati:', updatedStakeholders);
    setStakeholders(updatedStakeholders);
    setIsAddingNewStakeholder(false);
    setNewOptionLabel('');
    setInputKey((prevKey) => prevKey + 1); // Aggiorna la chiave dinamica per forzare il rerender
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
          key={inputKey} // Aggiungi la chiave dinamica qui
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
                ? Array.isArray(selectedOptions) ? selectedOptions.map((option) => option.value) : []
                : [],
            );
          }}
          required={true}
          placeholder="Select stakeholder(s)"
          error={errors.stakeholders}
          addNew={true}
          onAddNewSelect={() => setIsAddingNewStakeholder(true)}
        />
        {isAddingNewStakeholder && (
          <div className="flex items-center p-2 mt-2">
            <InputComponent
              label="New Stakeholder"
              type="text"
              value={newOptionLabel}
              onChange={(v) => {
                if ('target' in v) {
                  setNewOptionLabel(v.target.value);
                }
              }}
              placeholder="Enter new stakeholder"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveNewStakeholder({ value: newOptionLabel, label: newOptionLabel });
                }
              }}
              inputRef={newStakeholderInputRef} // Imposta il riferimento al campo di input
            />
            <ButtonRounded
              variant="filled"
              text="Confirm"
              className="ml-4 bg-black text-white text-xs pt-2 pb-2 pl-3 pr-3" // Aggiungi margine sinistro
              onClick={() => handleSaveNewStakeholder({ value: newOptionLabel, label: newOptionLabel })}
            />
          </div>
        )}
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
    </>
  );
};

export default Step1;