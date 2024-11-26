import React, { useState, useEffect } from 'react';
import InputComponent from '../../atoms/input/input';
import './Step1.css';

interface Step1Props {
  title: string;
  setTitle: (value: string) => void;
  stakeholders: string[];
  setStakeholders: (value: string[]) => void;
  scale: string;
  setScale: (value: string) => void;
  issuanceDate: string;
  setIssuanceDate: (value: string) => void;
  customScale: string;
  setCustomScale: (value: string) => void;
  errors: { [key: string]: string };
}

const stakeholderOptions = [
  { value: 'LKAB', label: 'LKAB' },
  { value: 'Municipalty', label: 'Municipalty' },
  { value: 'RegionalAuthority', label: 'Regional Authority' },
  { value: 'ArchitectureFirms', label: 'Architecture Firms' },
  { value: 'Citizens', label: 'Citizens' },
  { value: 'Others', label: 'Others' },
];

const scaleOptions = [
  { value: 'Architectural Style', label: 'Architectural Style' },
  { value: 'pippo', label: 'pippo' },
  { value: 'pluto', label: 'pluto' },
  { value: 'altro', label: 'altro' },
];

const Step1: React.FC<Step1Props> = ({
  title,
  setTitle,
  stakeholders,
  setStakeholders,
  scale,
  setScale,
  issuanceDate,
  setIssuanceDate,
  customScale,
  setCustomScale,
  errors,
}) => {
  useEffect(() => {
    console.log('useEffect - scale:', scale);
    if (scale !== 'Architectural Style') {
      setCustomScale('');
    }
  }, [scale, setCustomScale]);

  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');

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

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const years = Array.from({ length: 100 }, (_, i) =>
    (new Date().getFullYear() - i).toString(),
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0'),
  );
  const days =
    selectedYear && selectedMonth
      ? Array.from(
          {
            length: getDaysInMonth(
              parseInt(selectedYear),
              parseInt(selectedMonth),
            ),
          },
          (_, i) => (i + 1).toString().padStart(2, '0'),
        )
      : [];

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
                ? Array.isArray(selectedOptions)
                  ? selectedOptions.map((option) => option.value)
                  : []
                : [],
            );
          }}
          required={true}
          placeholder="Select stakeholder(s)"
          error={errors.stakeholders}
        />
      </div>

      {/* Scale of document */}
      <div
        className={`my-2 ${scale === 'Architectural Style' ? 'inline-fields' : ''}`}
      >
        <InputComponent
          label="Scale"
          type="select"
          options={scaleOptions}
          value={{ value: scale, label: scale }}
          onChange={(e) => {
            if ('target' in e) {
              const selectedOption = e.target.value;
              console.log('onChange - selectedOption:', selectedOption);
              setScale(selectedOption);
            }
          }}
          required={true}
          placeholder="Select scale"
          error={errors.scale}
        />

        {/* Custom Scale Input */}
        {scale === 'Architectural Style' && (
          <InputComponent
            label="Custom Scale"
            type="text"
            value={customScale}
            onChange={(v) => {
              if ('target' in v) {
                setCustomScale(v.target.value);
              }
            }}
            required={true}
            placeholder="Enter custom scale"
            error={errors.customScale}
          />
        )}
      </div>

      {/* Issuance date of document */}
      <div className="my-2">
        <label>Issuance date</label>
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
            options={months.map((month) => ({ value: month, label: month }))}
            placeholder="Month"
          />
          <InputComponent
            label="Day"
            type="select"
            value={selectedDay}
            onChange={(e) =>
              setSelectedDay(
                (e as React.ChangeEvent<HTMLSelectElement>).target.value,
              )
            }
            disabled={!selectedYear || !selectedMonth}
            options={days.map((day) => ({ value: day, label: day }))}
            placeholder="Day"
          />
        </div>
      </div>
    </>
  );
};

export default Step1;
