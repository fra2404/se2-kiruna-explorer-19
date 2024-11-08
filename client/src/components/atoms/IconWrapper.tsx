import React from 'react';
import { LuCheck } from 'react-icons/lu';
import { MdDeleteOutline } from 'react-icons/md';

interface IconWrapperProps {
  type: 'success' | 'error';
}

const IconWrapper: React.FC<IconWrapperProps> = ({ type }) => {
  return (
    <div
      className={`w-10 h-10 flex items-center justify-center rounded-full 
      ${type === 'error' ? 'bg-red-50' : 'bg-green-50'}`}
    >
      {type === 'error' ? (
        <MdDeleteOutline className="text-xl text-red-500" />
      ) : (
        <LuCheck className="text-xl text-green-500" />
      )}
    </div>
  );
};

export default IconWrapper;
