import React from 'react';
import {StyleSheet, View} from 'react-native';

import {color, useTheme} from "@/hooks/useThemeColor";

export default function ThirdTab() {
    return (
        <View style={[{backgroundColor: color(useTheme(), 'inputBackground')}]}>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {fontSize: 18},
});
