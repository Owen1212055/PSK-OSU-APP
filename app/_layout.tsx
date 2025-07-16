import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import {ThemeProviderCtx, useThemeCtx} from "@/contexts/ThemeProvider";


export default function RootLayout() {
    const NavigationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        const { effective } = useThemeCtx();
        const navTheme = effective === 'dark' ? DarkTheme : DefaultTheme;
        return <ThemeProvider value={navTheme}>{children}</ThemeProvider>;
    };


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProviderCtx>
                <NavigationWrapper>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
                    </Stack>
                </NavigationWrapper>
            </ThemeProviderCtx>
        </GestureHandlerRootView>
    );
}
