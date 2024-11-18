import React from 'react';
import ConnectionList from '../../organisms/documentConnections/ConnectionList';
import ButtonRounded from '../../atoms/button/ButtonRounded';
import InputComponent from '../../atoms/input/input';

interface Step4Props {
  connections: any[];
  handleDeleteConnection: (index: number) => void;
  setConnectionModalOpen: (open: boolean) => void;
  connectToMap: boolean;
  setConnectToMap: (connect: boolean) => void;
}

const Step4: React.FC<Step4Props> = ({
  connections,
  handleDeleteConnection,
  setConnectionModalOpen,
  connectToMap,
  setConnectToMap,
}) => {
  return (
    <>
      {/* Connections */}
      <div className="my-2 col-span-2">
        <label className="font-semibold">Connections</label>

        {connections?.length === 0 ? (
          <p className="mt-1 text-gray-500">No connections yet</p>
        ) : (
          connections?.length > 0 && (
            <ConnectionList
              connections={connections}
              handleDelete={handleDeleteConnection}
            />
          )
        )}

        <div className="flex items-center justify-center max-w-[100px] md:mx-auto my-2">
          <ButtonRounded
            variant="filled"
            text="Add Connection"
            className="bg-black text-white text-xs pt-2 pb-2 pl-3 pr-3"
            onClick={() => setConnectionModalOpen(true)}
          />
        </div>
      </div>

      {/* Connect to map */}
      <div className="my-2 col-span-2">
        <InputComponent
          label="Connect this document to a point on the map"
          type="checkbox"
          checked={connectToMap}
          onChange={() => setConnectToMap(!connectToMap)}/>
      </div>
    </>
  );
};

export default Step4;
