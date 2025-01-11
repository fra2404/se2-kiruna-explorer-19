import React, { useState, useEffect, useRef } from 'react';
import InputComponent from '../../atoms/input/input';
import './Step1.css';
import { scaleOptions } from '../../../shared/scale.options.const';
import { years, months, getDays } from '../../../utils/date';
import ButtonRounded from '../../atoms/button/ButtonRounded';
import { getStakeholders, createStakeholder } from '../../../API'; // Imports getStakeholders and createStakeholder functions
import { IStakeholder } from '../../../utils/interfaces/stakeholders.interface';

interface Step1Props {
  title: string;
  setTitle: (value: string) => void;
  stakeholders: IStakeholder[];
  setStakeholders: (value: IStakeholder[]) => void;
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
  const [stakeholderOptions, setStakeholderOptions] = useState<{ value: string; label: string }[]>([]);
  const [isAddingNewStakeholder, setIsAddingNewStakeholder] = useState(false);
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [inputKey, setInputKey] = useState(0); // Add a state fot the dynamic key
  const newStakeholderInputRef = useRef<HTMLInputElement>(null); // Creates a refereng for the input field

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
      newStakeholderInputRef.current.focus(); // Sets the focus on the input field
    }
  }, [isAddingNewStakeholder]);

  useEffect(() => {
    // Function that retrieves stakeholders from backend
    const fetchStakeholders = async () => {
      try {
        const options = await getStakeholders();
        setStakeholderOptions(options);
      } catch (error) {
        console.error('Error when retrieving stakeholders:', error);
      }
    };

    fetchStakeholders();
  }, []);

  const handleSaveNewStakeholder = async (newStakeholderType: string) => {
    try {
      const newStakeholder = await createStakeholder(newStakeholderType);
      const formattedStakeholder = { _id: newStakeholder.value, type: newStakeholder.label };
      setStakeholderOptions([...stakeholderOptions, { value: newStakeholder.value, label: newStakeholder.label }]);
      const updatedStakeholders: IStakeholder[] = [...stakeholders, formattedStakeholder];
      console.log('Stakeholders selezionati:', updatedStakeholders);
      setStakeholders(updatedStakeholders);
      setIsAddingNewStakeholder(false);
      setNewOptionLabel('');
      setInputKey((prevKey) => prevKey + 1); // Updates the dynamic key to force the refresh of the page
    } catch (error) {
      console.error('Error when creating a new stakeholder:', error);
    }
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
          key={inputKey} // Add the dynamic key here
          label="Stakeholder(s)"
          type="multi-select"
          options={stakeholderOptions}
          value={stakeholders.map((stakeholder) => {
            const stakeholderOption = stakeholderOptions.find(option => option.value === stakeholder._id);
            return stakeholderOption ? { value: stakeholderOption.value, label: stakeholderOption.label } : { value: stakeholder._id, label: stakeholder.type };
          })}
          onChange={(selectedOptions) => {
            let newStakeholders: IStakeholder[] = [];
            if (selectedOptions) {
              if (Array.isArray(selectedOptions)) {
                newStakeholders = selectedOptions.map((option) => ({ _id: option.value, type: option.label }));
              }
            }
            setStakeholders(newStakeholders);
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
                  handleSaveNewStakeholder(newOptionLabel);
                }
              }}
              inputRef={newStakeholderInputRef} // Sets the input filed reference
            />
            <ButtonRounded
              variant="filled"
              text="Confirm"
              className="ml-4 bg-black text-white text-xs pt-2 pb-2 pl-3 pr-3"
              onClick={() => handleSaveNewStakeholder(newOptionLabel)}
            >
              Confirm
            </ButtonRounded>
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