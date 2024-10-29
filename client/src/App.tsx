import React, { useState } from 'react';
import InputComponent from './components/atoms/input/input';

const options = [
  { value: 'US', label: 'United States', code: 'US', prefix: '+1' },
  { value: 'IT', label: 'Italy', code: 'IT', prefix: '+39' },
  { value: 'FR', label: 'France', code: 'FR', prefix: '+33' },
];

function App() {
  const [value, setValue] = useState('');

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setValue(event.target.value);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg space-y-4">
        <InputComponent
          label="Email"
          type="email"
          value={value}
          onChange={handleChange}
          required
        />
        <InputComponent
          label="Password"
          type="password"
          value={value}
          onChange={handleChange}
          required
        />
        <InputComponent
          label="Text"
          type="text"
          value={value}
          onChange={handleChange}
          required
        />
        <InputComponent
          label="Textarea"
          type="textarea"
          value={value}
          onChange={handleChange}
          required
        />
        <InputComponent
          label="Select"
          type="select"
          value={value}
          onChange={handleChange}
          options={options}
          required
        />
        <InputComponent
          label="Radio"
          type="radio"
          value={value}
          onChange={handleChange}
          options={options}
          required
        />
      </div>
    </div>
  );
}

export default App;
