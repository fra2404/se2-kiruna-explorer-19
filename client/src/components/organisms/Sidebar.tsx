import React, { useState } from "react";
import ButtonRounded from "../atoms/button/ButtonRounded";
import { FaBars } from "react-icons/fa";
import Filters from "../molecules/filters/Filters";
import Searchbar from "../molecules/Searchbar";
import useToast from "../../utils/hooks/toast";
import Toast from "./Toast";
import { IDocument } from "../../utils/interfaces/document.interface";
import { FaX } from "react-icons/fa6";

interface SidebarProps {
  setFilteredDocuments: (documents: IDocument[]) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  setFilteredDocuments
}) => {

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
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const {toast, showToast, hideToast} = useToast();
  
  return (
    <>
      <ButtonRounded 
        text={<FaBars />}
        variant="filled"
        className="bg-black px-3 text-base"
        onClick={() => setSidebarVisible(true)}
      />
      <nav
        style={{
          background: '#ffffff',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          right: sidebarVisible ? "0" : "-100%",
          transition: '350ms'
        }}
        className='xl:w-2/5 lg:w-4/6 md:w-5/6 w-full'
      >
        <div className='flex flex-col w-full p-2'>
          <FaX 
            style={{
              right: '0px',
              fontSize: '40px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            onClick={() => setSidebarVisible(false)}
            className='self-end'
          />

          <h2 className='text-xl pt-4'>Filters</h2>            
          <Filters filters={filters} setFilters={setFilters} />

          <Searchbar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilteredDocuments={setFilteredDocuments}
            showToast={showToast}
          />
        </div>
      </nav>

      {
        toast.isShown && (
          <Toast isShown={toast.isShown} message={toast.message} 
            type={toast.type} onClose={hideToast}
          />
        )
      }
    </>
  )
}