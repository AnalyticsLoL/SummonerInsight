import React, { createContext, useContext, useState } from 'react';

// Create a context
const Context = createContext();

// Custom hook to use the LoadingContext
export const useGlobal = () => {
    return useContext(Context);
};

// Provider component
export const ContextProvider = ({ children }) => {
    const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);

    // Reset all states
    const resetState = () => {
        setIsLoadingGlobal(false);
    };

    return (
        <Context.Provider value={{ isLoadingGlobal, setIsLoadingGlobal, resetState }}>
            {children}
        </Context.Provider>
    );
};
