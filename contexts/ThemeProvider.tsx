import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppearanceMode = 'system' | 'light' | 'dark';
const STORAGE_KEY = '@appearance_mode';

interface Value {
    mode: AppearanceMode;
    effective: 'light' | 'dark';
    setMode: (m: AppearanceMode) => void;
}

const Ctx = createContext<Value>({ mode: 'system', effective: 'light', setMode: () => {} });

export const ThemeProviderCtx: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const system = useColorScheme() === 'dark' ? 'dark' : 'light';
    const [mode, setMode] = useState<AppearanceMode>('system');

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then(saved => {
            if (saved === 'light' || saved === 'dark' || saved === 'system') setMode(saved);
        });
    }, []);

    const save = (m: AppearanceMode) => {
        setMode(m);
        AsyncStorage.setItem(STORAGE_KEY, m).catch(console.warn);
    };

    const effective: 'light' | 'dark' = mode === 'system' ? system : mode;
    return (
        <Ctx.Provider value={{ mode, effective, setMode: save }}>
            {children}
        </Ctx.Provider>
    );
};

export const useThemeCtx = () => useContext(Ctx);