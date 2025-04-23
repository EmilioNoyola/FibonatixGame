import React, { createContext, useContext, useState } from 'react';

const FocusContext = createContext();

export const FocusProvider = ({ children }) => {
    const [isFocusOn, setIsFocusOn] = useState(true);
    return (
        <FocusContext.Provider value={{ isFocusOn, setIsFocusOn }}>
            {children}
        </FocusContext.Provider>
    );
};

export const useFocus = () => useContext(FocusContext);