import React, { useState } from "react";
import ButtonRounded from "../atoms/button/ButtonRounded";
import { FaBars } from "react-icons/fa";
import Filters from "../molecules/filters/Filters";

interface SidebarProps {

}

export const Sidebar: React.FC<SidebarProps> = ({

}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [filters, setFilters] = useState<{
    type: string;
    stakeholders: string[];
    coordinates: string;
    year: string;
    month: string;
    day: string;
    language: string;
    scale: string;
    architecturalScale: string;
  }>({
    type: '',
    stakeholders: [],
    coordinates: '',
    year: '',
    month: '',
    day: '',
    language: '',
    scale: '',
    architecturalScale: '',
  });
  
  return (
    <>
      <ButtonRounded 
        text={<FaBars />}
        variant="filled"
        className="bg-black px-3 text-base"
        onClick={() => setSidebarVisible(true)}
      />

      {sidebarVisible && 
        <div 
          className="w-screen h-screen absolute inset-0 bg-white/75"
          onClick={() => setSidebarVisible(false)}
        >
        </div>
      }
      <nav
        style={{
          background: '#ffffff',
          width: '40%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          right: sidebarVisible ? "0" : "-100%",
          transition: '350ms'
        }}
      >
        <div className='flex flex-col w-full'>
          <h2 className='text-xl pt-4'>Filters</h2>            
          <Filters filters={filters} setFilters={setFilters} />
        </div>
      </nav>
    </>
  )
}