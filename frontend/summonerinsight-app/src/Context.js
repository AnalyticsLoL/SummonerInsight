import React, { createContext, useContext, useState } from 'react';

// Create a context
const Context = createContext();

// Custom hook to use the LoadingContext
export const useGlobal = () => {
    return useContext(Context);
};

// Provider component
export const SummonerContext = ({ children }) => {
    const [summonerInfo, setSummonerInfo] = useState(null);
    const [matchHistory, setMatchHistory] = useState(null);

    // Reset all states
    const resetState = () => {
        setSummonerInfo(null);
        setMatchHistory(null);
    };

    return (
        <Context.Provider value={{ summonerInfo, setSummonerInfo, matchHistory, setMatchHistory, resetState }}>
            {children}
        </Context.Provider>
    );
};
