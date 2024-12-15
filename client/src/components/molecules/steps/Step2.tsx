import React, { useState, useEffect, useRef } from 'react';
import InputComponent from '../../atoms/input/input';
import ButtonRounded from '../../atoms/button/ButtonRounded';
import { getDocumentTypes, createDocumentType } from '../../../API'; // Importa le funzioni getDocumentTypes e createDocumentType
import { IDocumentType } from '../../../utils/interfaces/documentTypes.interface';

interface Step2Props {
  description: string;
  setDescription: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  docType: IDocumentType;
  setDocType: (value: IDocumentType) => void;
  documentTypeOptions: { value: string; label: string }[];
  errors: { [key: string]: string };
}

const Step2: React.FC<Step2Props> = ({
  description,
  setDescription,
  language,
  setLanguage,
  docType,
  setDocType,
  documentTypeOptions,
  errors,
}) => {
  const [isAddingNewDocType, setIsAddingNewDocType] = useState(false);
  const [newDocTypeLabel, setNewDocTypeLabel] = useState('');
  const [docTypeOptions, setDocTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [inputKey, setInputKey] = useState(0); // Aggiungi uno stato per la chiave dinamica
  const newDocTypeInputRef = useRef<HTMLInputElement>(null); // Crea un riferimento per il campo di input

  useEffect(() => {
    setInputKey((prevKey) => prevKey + 1); // Forza il rerender quando docType cambia
  }, [docType]);

  useEffect(() => {
    if (isAddingNewDocType && newDocTypeInputRef.current) {
      newDocTypeInputRef.current.focus(); // Imposta il focus sul campo di input
    }
  }, [isAddingNewDocType]);

  useEffect(() => {
    // Funzione per recuperare i tipi di documento dal backend
    const fetchDocumentTypes = async () => {
      try {
        const options = await getDocumentTypes();
        setDocTypeOptions(options);
      } catch (error) {
        console.error('Errore nel recupero dei tipi di documento:', error);
      }
    };

    fetchDocumentTypes();
  }, []);

  const handleSaveNewDocType = async () => {
    try {
      const newDocType = await createDocumentType(newDocTypeLabel);
      const formattedDocType = { value: newDocType.value, label: newDocType.label };
      setDocTypeOptions([...docTypeOptions, formattedDocType]);
      setDocType({ _id: newDocType.value, type: newDocType.label });
      console.log('Tipo di documento selezionato:', newDocType.value);
      setIsAddingNewDocType(false);
      setNewDocTypeLabel('');
    } catch (error) {
      console.error('Errore nella creazione del nuovo tipo di documento:', error);
    }
  };

  return (
    <>
      {/* Description */}
      <div className="my-2 col-span-2">
        <InputComponent
          label="Description"
          type="textarea"
          value={description}
          onChange={(e) => {
            if ('target' in e) {
              setDescription(e.target.value);
            }
          }}
          required={false}
          placeholder="Enter description"
          maxLength={1000}
          error={errors.description}
        />
      </div>

      {/* Language */}
      <div className="my-2">
        <InputComponent
          label="Language"
          type="text"
          value={language}
          onChange={(e) => {
            if ('target' in e) {
              setLanguage(e.target.value);
            }
          }}
          placeholder="Enter language"
          error={errors.language}
        />
      </div>

      {/* Type of document */}
      <div className="my-2 col-span-2">
        <InputComponent
          key={inputKey} // Aggiungi la chiave dinamica qui
          label="Type"
          type="select"
          options={docTypeOptions}
          value={docType._id} // Passa l'_id del docType come valore
          onChange={(e) => {
            if ('target' in e) {
              const selectedOption = docTypeOptions.find(option => option.value === e.target.value);
              if (selectedOption) {
                setDocType({ _id: selectedOption.value, type: selectedOption.label });
                console.log('Tipo di documento selezionato:', selectedOption.value);
              }
            }
          }}
          required={true}
          placeholder="Select document type..."
          error={errors.docType}
          addNew={true}
          onAddNewSelect={() => setIsAddingNewDocType(true)}
        />
        {isAddingNewDocType && (
          <div className="flex items-center p-2 mt-2">
            <InputComponent
              label="New Document Type"
              type="text"
              value={newDocTypeLabel}
              onChange={(v) => {
                if ('target' in v) {
                  setNewDocTypeLabel(v.target.value);
                }
              }}
              placeholder="Enter new document type"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveNewDocType();
                }
              }}
              inputRef={newDocTypeInputRef} // Imposta il riferimento al campo di input
            />
            <ButtonRounded
              variant="filled"
              text="Confirm"
              className="ml-4 bg-black text-white text-xs pt-2 pb-2 pl-3 pr-3"
              onClick={handleSaveNewDocType}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Step2;