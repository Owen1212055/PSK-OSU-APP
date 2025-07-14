import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Slot} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import {GestureHandlerRootView} from 'react-native-gesture-handler';


export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <GestureHandlerRootView>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Slot/>
                <StatusBar style="auto"/>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}