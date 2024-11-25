import React, { ChangeEvent, useEffect, useState, useCallback } from 'react';
import Select from 'react-select';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
  code?: string;
  prefix?: string;
}

interface InputComponentProps {
  label: string;
  placeholder?: string;
  type:
    | 'text'
    | 'select'
    | 'radio'
    | 'password'
    | 'email'
    | 'textarea'
    | 'date'
    | 'checkbox';
  options?: Option[];
  required?: boolean;
  name?: string;
  value?: string | Option;
  defaultValue?: string;
  checked?: boolean;
  onChange?: (
    event:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | Option,
  ) => void;
  onValidityChange?: (isValid: boolean) => void;
  disabled?: boolean;
  max?: string;
  maxLength?: number;
  returnObject?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void; // Aggiungi questa proprietà
  error?: string; // Aggiungi questa proprietà
}

const mockFlags = {
  US: '🇺🇸',
  IT: '🇮🇹',
  FR: '🇫🇷',
};

const CustomSingleValue = React.memo(({ data }: { data: Option }) => {
  return (
    <div className="flex items-center">
      {data.icon && (
        <span className="mr-2" style={{ maxWidth: '20px', maxHeight: '20px' }}>
          {data.icon}
        </span>
      )}
      {data.code && (
        <span>{mockFlags[data.code as keyof typeof mockFlags]}</span>
      )}
      <span className="ml-2">
        {data.prefix} {data.label}
      </span>
    </div>
  );
});
CustomSingleValue.displayName = 'CustomSingleValue';

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  placeholder,
  type,
  options = [],
  required = false,
  name,
  value,
  defaultValue,
  checked,
  onChange,
  onValidityChange,
  disabled = false,
  max,
  maxLength,
  returnObject = false,
  onKeyDown, // Aggiungi questa proprietà
  error, // Aggiungi questa proprietà
}) => {
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isFieldEmpty, setIsFieldEmpty] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    options.find((option) => option.value === defaultValue) || null,
  );
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = useCallback(
    (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);
      setIsEmailValid(isValid);
      if (onValidityChange) {
        onValidityChange(isValid);
      }
    },
    [onValidityChange],
  );

  const validateField = useCallback(
    (value: string) => {
      if (required) {
        const isEmpty = !value;
        setIsFieldEmpty(isEmpty);
        if (onValidityChange) {
          onValidityChange(!isEmpty);
        }
      }
    },
    [required, onValidityChange],
  );

  useEffect(() => {
    if (type === 'email') {
      validateEmail((value as string) || '');
    } else if (
      type === 'text' ||
      type === 'password' ||
      type === 'textarea' ||
      type === 'date'
    ) {
      validateField((value as string) || '');
    }
  }, [value, type, validateEmail, validateField]);

  const customOption = useCallback(
    (props: { data: Option; innerRef: any; innerProps: any }) => {
      const { data, innerRef, innerProps } = props;
      return (
        <div ref={innerRef} {...innerProps} className="flex items-center p-2">
          {data.icon && (
            <span
              className="mr-2"
              style={{ maxWidth: '20px', maxHeight: '20px' }}
            >
              {data.icon}
            </span>
          )}
          {data.code && (
            <span>{mockFlags[data.code as keyof typeof mockFlags]}</span>
          )}
          <p className="ml-2">
            {data.prefix} {data.label}
          </p>
        </div>
      );
    },
    [],
  );

  const handleBlur = useCallback(() => {
    setIsTouched(true);
    if (type === 'email') {
      validateEmail((value as string) || '');
    }
    if (required) {
      validateField((value as string) || '');
    }
  }, [type, required, validateEmail, validateField, value]);

  const inputClassName = `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
    type === 'email' && !isEmailValid && isTouched ? 'border-red-500' : ''
  } ${isFieldEmpty && isTouched ? 'border-red-500' : ''} ${
    error ? 'border-red-500' : ''
  }`;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSelectChange = (selectedOption: Option | null) => {
    setSelectedOption(selectedOption);
    if (onChange) {
      if (returnObject) {
        if (selectedOption) {
          onChange(selectedOption); // Passa l'intero oggetto selezionato
        }
      } else {
        onChange({
          target: {
            value: selectedOption ? selectedOption.value : '',
            name,
          } as any,
        } as ChangeEvent<HTMLSelectElement>);
      }
    }
  };

  const selectOptions = selectedOption
    ? [{ value: '', label: 'Cancel selection' }, ...options]
    : options;

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {(type === 'text' ||
        type === 'password' ||
        type === 'email' ||
        type === 'date') && (
        <div className="relative">
          <input
            className={inputClassName}
            type={
              type === 'password' ? (showPassword ? 'text' : 'password') : type
            }
            placeholder={placeholder}
            required={required}
            name={name}
            value={value as string}
            onChange={onChange}
            onBlur={handleBlur}
            disabled={disabled}
            max={type === 'date' ? max : undefined}
            onKeyDown={onKeyDown} // Aggiungi questa proprietà
          />
          {type === 'password' && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
        </div>
      )}
      {type === 'textarea' && (
        <textarea
          className={`${inputClassName} h-32 resize-none`}
          placeholder={placeholder}
          required={required}
          name={name}
          value={value as string}
          onChange={onChange}
          onBlur={handleBlur}
          disabled={disabled}
          maxLength={maxLength}
        />
      )}
      {type === 'select' && (
        <Select
          className="shadow appearance-none rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          options={selectOptions}
          onChange={handleSelectChange}
          components={{ SingleValue: CustomSingleValue, Option: customOption }}
          name={name}
          value={selectedOption}
          defaultValue={options.find((option) => option.value === defaultValue)}
          isDisabled={disabled}
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          menuPortalTarget={document.body}
          styles={{
            control: (provided) => ({
              ...provided,
              minHeight: 'auto',
              height: '2.5rem',
            }),
            valueContainer: (provided) => ({
              ...provided,
              padding: '0',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
            }),
            input: (provided) => ({
              ...provided,
              margin: '0',
              padding: '0',
            }),
            singleValue: (provided) => ({
              ...provided,
              display: 'flex',
              alignItems: 'center',
            }),
            menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
          }}
        />
      )}
      {type === 'radio' && (
        <div className="flex flex-col">
          {options.map((option) => (
            <label key={option.value} className="inline-flex items-center mt-2">
              <input
                type="radio"
                name={name ?? label}
                value={option.value}
                checked={value === option.value}
                required={required}
                onChange={onChange}
                disabled={disabled}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
        </div>
      )}
      {type === 'checkbox' && (
        <div className="flex items-center">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="ml-2">{label}</span>
        </div>
      )}
      {isFieldEmpty && required && isTouched && (
        <span className="text-red-500 text-xs italic">Invalid input</span>
      )}
      {!isFieldEmpty && !isEmailValid && type === 'email' && isTouched && (
        <span className="text-red-500 text-xs italic">Email non valida</span>
      )}
      {error && <span className="text-red-500 text-xs italic">{error}</span>}
    </div>
  );
};

export default InputComponent;
