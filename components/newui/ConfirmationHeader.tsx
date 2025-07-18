import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { color, inverseColor, Theme, useTheme } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import {GestureResponderEvent} from "react-native/Libraries/Types/CoreEventTypes";

interface ConfirmationHeaderProps {
    label?: string;
    confirmation_label?: string;
    popup?: boolean;
    on_done?: (event: GestureResponderEvent) => void;
}

export function ConfirmationHeader({
                                       label,
                                       confirmation_label = "Done",
                                       popup = false,
                                       on_done
                                   }: ConfirmationHeaderProps) {
    const styles = useStyles(useTheme());
    const onPress = () => router.back();

    return (
        <View style={styles.navbar}>
            <View style={styles.navbarElement}>
                {!popup && (
                    <TouchableOpacity onPress={onPress} style={styles.cancel}>
                        <Text style={styles.cancelText}>{label}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.navbarClose}>
                <TouchableOpacity onPress={on_done} style={styles.touchable}>
                    <Text style={styles.confirmationText}>{confirmation_label}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        navbar: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        navbarElement: {
            justifyContent: 'center',
            alignItems: 'flex-start',
        },
        navbarClose: {
            justifyContent: 'center',
            alignItems: 'flex-start'
        },
        cancel: {
            alignSelf: 'flex-start',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 18,
            paddingVertical: 12,
            borderRadius: 32
        },
        touchable: {
            alignSelf: 'flex-start',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 18,
            paddingVertical: 12,
            backgroundColor: color(theme, 'text'),
            borderRadius: 32
        },
        cancelText: {
            fontSize: 14,
            fontWeight: '500',
            color: color(theme, 'text')
        },
        confirmationText: {
            fontSize: 16,
            fontWeight: '700',
            color: inverseColor(theme, 'text')
        },
    });
}