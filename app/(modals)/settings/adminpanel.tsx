import React, { useEffect, useState } from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import { useTheme, Theme } from '@/hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavBar } from '@/components/newui/input/NavBar';
import { RoundedRadioButtonBox } from '@/components/newui/input/RoundedRadioButtonBox';
import { router } from 'expo-router';
import {AppearanceMode, useThemeCtx} from "@/contexts/ThemeProvider";
import AdminPanel from "@/app/(app)/adminpanel";

export default function AdminPanelScreen() {
    const theme = useTheme();
    const styles = useStyles(theme);

    const { mode, setMode } = useThemeCtx();

    const handleSelect = (next: AppearanceMode) => {
        setMode(next);
    };

    return (
        <View style={styles.root}>
            <NavBar label="Back" title="Admin Panel" />
            <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
                <AdminPanel/>
            </ScrollView>
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