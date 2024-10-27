import React, { createContext, useContext, useState } from 'react';

// Create a context
const Context = createContext();

// Custom hook to use the LoadingContext
export const useGlobal = () => {
    return useContext(Context);
};

// Provider component
export const ContextProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    // Reset all states
    const resetState = () => {
        setIsLoading(false);
    };

    return (
        <Context.Provider value={{ isLoading, setIsLoading, resetState }}>
            {children}
        </Context.Provider>
    );
};
