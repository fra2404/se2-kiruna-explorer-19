import React, { useEffect, useState } from 'react';
import './Legend.css'; // Importa il file CSS per la legenda
import { getStakeholders, getTypes } from '../../../API';
import { DocumentIcon, stakeholdersColors } from '../documentsItems/DocumentIcon'; // Importa le icone specifiche per i tipi di documenti

interface LegendProps {
  isOpen: boolean;
}

const Legend2: React.FC<LegendProps> = ({ isOpen }) => {
  const [stakeholders, setStakeholders] = useState<{ _id: string; type: string }[]>([]);
  const [types, setTypes] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchStakeholders = async () => {
      const stakeholdersData = await getStakeholders();
      setStakeholders(
        stakeholdersData.map((s) => ({ _id: s.value, type: s.label })),
      );
    };

    const fetchTypes = async () => {
      const typesData = await getTypes();
      console.log('Types data:', typesData); // Stampa su console i tipi che arrivano
      setTypes(
        typesData.map((t: { label: string; value: string }) => ({ _id: t.value, name: t.label })),
      );
    };

    fetchStakeholders();
    fetchTypes();
  }, []);

  return (
    <div className={`legend ${isOpen ? 'open' : ''}`}>
      
      <div className="legend-part1">
        <h4>Stakeholders Colors</h4>
        <ul>
          {stakeholders.map((stakeholder) => {
            const color = stakeholdersColors([stakeholder])[0];
            return (
              <li key={stakeholder._id} style={{ color }}>
                {stakeholder.type}
              </li>
            );
          })}
        </ul>
      </div>

      <div className='vertical-line'></div>

      <div className="legend-part2">
        <h4>Documents Icons</h4>
        <ul>
          {types.map((type) => {
            return (
              <li key={type._id}>
                <DocumentIcon type={type.name} /> {type.name}
              </li>
            );
          })}
        </ul>
      </div>
      
    </div>
  );
};

export default Legend2;