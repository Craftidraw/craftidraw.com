'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

export const ThemeProvider = ({
    children,
    defaultTheme = 'system',
    storageKey = 'theme-preference',
}: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') return defaultTheme;

        const savedTheme = localStorage.getItem(storageKey) as Theme;
        return savedTheme || defaultTheme;
    });

    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;

        if (theme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return theme === 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;

        const updateTheme = (isDark: boolean) => {
            root.classList.remove('light', 'dark');
            if (theme === 'system') {
                isDark ? root.classList.add('dark') : root.classList.add('light');
            } else {
                root.classList.add(theme);
            }
            setIsDarkMode(isDark);
        };

        if (theme === 'system') {
            const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            updateTheme(systemIsDark);
        } else {
            updateTheme(theme === 'dark');
        }

        localStorage.setItem(storageKey, theme);
    }, [theme, storageKey]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleMediaChange = (e: MediaQueryListEvent) => {
            if (theme === 'system') {
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(e.matches ? 'dark' : 'light');
                setIsDarkMode(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleMediaChange);
        return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            if (prevTheme === 'light') return 'dark';
            if (prevTheme === 'dark') return 'system';
            return 'light';
        });
    };

    const value = {
        theme,
        setTheme,
        toggleTheme,
        isDark: isDarkMode,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
