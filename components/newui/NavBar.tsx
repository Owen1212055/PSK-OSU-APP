import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Theme, color, useTheme } from '@/hooks/useThemeColor';

interface NavBarProps {
    label: string;
    onPress: () => void;
}

export function NavBar({ label, onPress }: NavBarProps) {
    const theme = useTheme();

    return (
        <View style={styles(theme).navbar}>
            <View style={styles(theme).navbarElement}>
                <TouchableOpacity onPress={onPress}>
                    <ThemedText type="navbar_location">{label}</ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function styles(theme: Theme) {
    return StyleSheet.create({
        navbar: {
            height: 40,
            paddingHorizontal: 4,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            alignSelf: 'stretch',
        },
        navbarElement: {
            paddingVertical: 8,
            justifyContent: 'center',
            alignItems: 'flex-start',
        },
    });
}
