import { useEffect, useState } from 'react';
import { stakeholdersColors } from './documentsItems/DocumentIcon';
import { getStakeholders } from '../../API';

const StakeholderLegend = () => {
  const [stakeholders, setStakeholders] = useState<
    { _id: string; type: string }[]
  >([]);

  useEffect(() => {
    const fetchStakeholders = async () => {
      const stakeholdersData = await getStakeholders();
      setStakeholders(
        stakeholdersData.map((s) => ({ _id: s.value, type: s.label })),
      );
    };

    fetchStakeholders();
  }, []);

  return (
    <div
      style={{
        width: '200px',
        height: 'auto',
        border: '1px solid black',
        padding: '10px',
        backgroundColor: 'white',
        textAlign: 'center', // Center text horizontally
      }}
    >
      {/* <h3>Stakeholders</h3> */}
      {stakeholders.map((stakeholder) => {
        const color = stakeholdersColors([stakeholder])[0];
        return (
          <div
            key={stakeholder._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center', // Center items horizontally
              marginTop: '5px',
              marginBottom: '5px',
              padding: '5px',
              cursor: 'default', // Keep cursor as default arrow
              fontWeight: 'bold',
              borderBottom: '1px solid lightgray',
            }}
          >
            <span style={{ marginLeft: '10px', color, cursor: 'default' }}>
              {stakeholder.type}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StakeholderLegend;
