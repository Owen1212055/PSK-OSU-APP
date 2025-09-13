import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import {ThemeProviderCtx, useThemeCtx} from "@/contexts/ThemeProvider";
import {BannerProvider} from "@/contexts/BannerProvider";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import React from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";

const NavigationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { effective } = useThemeCtx();
    const navTheme = effective === 'dark' ? DarkTheme : DefaultTheme;
    return <ThemeProvider value={navTheme}>{children}</ThemeProvider>;
};

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <BottomSheetModalProvider>
                    <ThemeProviderCtx>
                        <BannerProvider>
                            <NavigationWrapper>
                                <Stack screenOptions={{
                                    headerShown: false,
                                    animation: 'none'
                                }} initialRouteName="index">
                                    <Stack.Screen name="(modals)" options={{ presentation: 'modal', animation: 'default'}} />
                                </Stack>
                            </NavigationWrapper>
                        </BannerProvider>
                    </ThemeProviderCtx>
                </BottomSheetModalProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
