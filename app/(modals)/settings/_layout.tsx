import {Stack} from "expo-router";
import {StyleSheet, View} from "react-native";
import {color, Theme, useTheme} from "@/hooks/useThemeColor";

export default function SettingsLayout() {
    const styles = useStyles(useTheme());
    return (
        <View style={styles.root}>
            <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: styles.content
            }}/>
        </View>
    );
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        root: {
            flex: 1
        },
        content: {
            backgroundColor: color(theme, 'background'),
            padding: 16
        }
    });
}