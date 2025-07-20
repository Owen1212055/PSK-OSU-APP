import React from 'react';
import {StyleSheet, View} from 'react-native';
import AdminPanel from "@/app/(app)/adminpanel";
import HomeScreen from "@/app/(app)";
import {color, useTheme} from "@/hooks/useThemeColor";

export default function ThirdTab() {
    return (
        <View style={[{backgroundColor: color(useTheme(), 'inputBackground')}]}>
            <HomeScreen/>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {fontSize: 18},
});
