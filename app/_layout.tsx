// app/_layout.tsx
import {Stack} from 'expo-router';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useColorScheme} from 'react-native';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{headerShown: false}}>
                    <Stack.Screen
                        name="(modals)"
                        options={{
                            presentation: 'modal'
                        }}
                    />
                </Stack>

            </ThemeProvider>
        </GestureHandlerRootView>
    );
}