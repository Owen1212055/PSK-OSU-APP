import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ThemedText} from '@/components/ThemedText';
import {Theme, useTheme} from '@/hooks/useThemeColor';
import {router} from "expo-router";
import {X} from "lucide-react-native";

interface NavBarProps {
    label?: string;
    title?: string;
    popup?: boolean;
    onClose?: () => void;
}

export function NavBar({ label, title, popup = false, onClose }: NavBarProps) {
    const styles = useStyles(useTheme());
    const onPress = onClose ? onClose : () => router.back();

    return (
        <View style={styles.navbar}>
            <View style={styles.navbarElement}>
                {!popup && (
                    <TouchableOpacity onPress={onPress}>
                        <ThemedText type="navbar_location">{label}</ThemedText>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.navbarClose}>
                {popup && (
                    <TouchableOpacity onPress={onPress}>
                        <X width={18} height={18} strokeWidth={2.5} />
                    </TouchableOpacity>
                )}
            </View>

            {title && (
                <View pointerEvents="none" style={styles.titleWrapper}>
                    <ThemedText type="navbar_header">{title}</ThemedText>
                </View>
            )}
        </View>
    );
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        navbar: {
            height: 40,
            paddingHorizontal: 4,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        navbarElement: {
            paddingVertical: 8,
            justifyContent: 'center',
            alignItems: 'flex-start',
        },
        navbarClose: {
            paddingVertical: 8,
            justifyContent: 'center',
            alignItems: 'flex-start',
        },
        titleWrapper: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
        }
    });
}
