import {createContext, useEffect, useState} from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode === null ? false : JSON.parse(savedMode);
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('darkMode');
            const navbar = document.getElementsByClassName('side-navbar');
            const blackModal = document.getElementById('black-modal');
            for (let i = 0; i < navbar.length; i++) {
                navbar[i].classList.remove('lightMode');
                navbar[i].classList.add('darkMode');
            }
        } else {
            document.body.classList.remove('darkMode');
            const navbar = document.getElementsByClassName('side-navbar');
            for (let i = 0; i < navbar.length; i++) {
                navbar[i].classList.remove('darkMode');
                navbar[i].classList.add('lightMode');
            }
        }
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{darkMode, setDarkMode}}>
            {children}
        </ThemeContext.Provider>
    );
};
