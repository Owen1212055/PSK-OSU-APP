import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Index from "@/app";
import AdminPanel from "@/app/(app)/adminpanel";
import HomeScreen from "@/app/(app)";
import SettingsScreen from "@/app/(app)/settings";
import {color, useTheme} from "@/hooks/useThemeColor";

export default function ThirdTab() {
    return (
        <View style={[{backgroundColor: color(useTheme(), 'inputBackground')}]}>
            <HomeScreen/>
            <SettingsScreen/>
            <AdminPanel/>
        </View>
    );
}

const styles = StyleSheet.create({
    text: { fontSize: 18 },
});
