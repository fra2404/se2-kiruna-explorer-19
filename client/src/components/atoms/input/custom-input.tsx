import React, { useState } from "react";
import Select, { components, MenuProps, Props as SelectProps, GroupBase } from "react-select";

// Componente customizzato Menu
interface CustomSelectProps extends SelectProps<any, false> {
  addNewOption: (value: string) => void;
}

const CustomMenu = (props: MenuProps<any, false, GroupBase<any>> & { selectProps: CustomSelectProps }) => {
  const { children, selectProps } = props;
  const { onInputChange, inputValue, addNewOption } = selectProps;

  return (
    <div>
      <div style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value, { action: 'input-change', prevInputValue: inputValue })}
          placeholder="Aggiungi nuovo valore..."
          style={{
            width: "100%",
            padding: "6px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxSizing: "border-box",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputValue.trim()) {
              addNewOption(inputValue);
              e.preventDefault();
            }
          }}
        />
      </div>
      <components.Menu {...props}>{children}</components.Menu>
    </div>
  );
};

const App: React.FC = () => {
  const [options, setOptions] = useState([
    { value: "Opzione 1", label: "Opzione 1" },
    { value: "Opzione 2", label: "Opzione 2" },
  ]);
  const [inputValue, setInputValue] = useState("");

  // Aggiunge una nuova opzione
  const addNewOption = (value: string) => {
    const newOption = { value, label: value };
    setOptions((prevOptions) => [...prevOptions, newOption]);
    setInputValue(""); // Resetta il valore dell'input
  };

  return (
    <div style={{ width: "300px", margin: "0 auto", paddingTop: "50px" }}>
      <Select
        options={options}
        placeholder="Seleziona o aggiungi..."
        components={{ Menu: CustomMenu }}
        inputValue={inputValue}
        onInputChange={(value) => setInputValue(value)}
        isClearable
        menuIsOpen
        addNewOption={addNewOption} // Proprietà personalizzata passata al CustomMenu
      />
    </div>
  );
};

export default App;