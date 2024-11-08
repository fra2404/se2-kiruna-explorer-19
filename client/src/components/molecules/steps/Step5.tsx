import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const Step5: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full col-span-full">
      <FaCheckCircle className="w-24 h-24 text-green-500" />
      <h2 className="text-2xl font-bold mt-4">Document Saved</h2>
    </div>
  );
};

export default Step5;
