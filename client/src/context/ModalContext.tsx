import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextProps {
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <ModalContext.Provider value={{ modalOpen, setModalOpen }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = (): ModalContextProps => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};