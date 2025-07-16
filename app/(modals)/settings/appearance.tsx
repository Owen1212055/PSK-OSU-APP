import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, Theme } from '@/hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavBar } from '@/components/newui/input/NavBar';
import { RoundedRadioButtonBox } from '@/components/newui/input/RoundedRadioButtonBox';
import { router } from 'expo-router';
import {AppearanceMode, useThemeCtx} from "@/contexts/ThemeProvider";

export default function AppearanceScreen() {
    const theme = useTheme();
    const styles = useStyles(theme);

    const { mode, setMode } = useThemeCtx();

    const handleSelect = (next: AppearanceMode) => {
        setMode(next);
    };

    return (
        <View style={styles.root}>
            <NavBar label="Back" title="Appearance" />
            <View style={styles.options}>
                <RoundedRadioButtonBox
                    label="System"
                    active={mode === 'system'}
                    onToggle={() => handleSelect('system')}
                />
                <RoundedRadioButtonBox
                    label="Light Mode"
                    active={mode === 'light'}
                    onToggle={() => handleSelect('light')}
                />
                <RoundedRadioButtonBox
                    label="Dark Mode"
                    active={mode === 'dark'}
                    onToggle={() => handleSelect('dark')}
                />
            </View>
        </View>
    );
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        root: {
            flex: 1,
            gap: 16
        },
        options: {
            gap: 16,
            marginTop: 8
        }
    });
}