// Contexto del foco de sueño.
import React, { createContext, useContext, useState } from 'react';

const FocusContext = createContext();

export const FocusProvider = ({ children }) => {
    const [isFocusOn, setIsFocusOn] = useState(true);
    const [focusStartTime, setFocusStartTime] = useState(null);

    const toggleFocus = () => {
        const newFocusState = !isFocusOn;
        setIsFocusOn(newFocusState);
        if (newFocusState) {
            setFocusStartTime(Date.now());
        } else {
            setFocusStartTime(null);
        }
    };

    return (
        <FocusContext.Provider value={{ isFocusOn, setIsFocusOn, toggleFocus, focusStartTime }}>
            {children}
        </FocusContext.Provider>
    );
};

export const useFocus = () => useContext(FocusContext);