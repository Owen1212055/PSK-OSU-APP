import React from 'react';
import type {TextStyle, ViewStyle} from 'react-native';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';


export interface RoundedRadioButtonBoxProps {
    label: string;
    active: boolean;
    onToggle: () => void;
    style?: ViewStyle;
    labelStyle?: TextStyle;
}

export const RoundedRadioButtonBox: React.FC<RoundedRadioButtonBoxProps> = ({
                                                                                label,
                                                                                active,
                                                                                onToggle,
                                                                                style,
                                                                                labelStyle,
                                                                            }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={onToggle}
            accessibilityRole="radio"
            accessibilityState={{selected: active}}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
        >
            <View style={styles.outerCircle}>
                {active && <View style={styles.innerCircle}/>}
            </View>

            <Text style={[styles.text, labelStyle]}>{label}</Text>
        </TouchableOpacity>
    );
};

function createStyles(theme: Theme) {
    return StyleSheet.create({
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 32,
            borderWidth: 2,
            borderColor: 'rgba(0,0,0,0.1)',
            gap: 16,
            alignSelf: 'stretch',
        },
        outerCircle: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: color(theme, 'icon_color'),
            justifyContent: 'center',
            alignItems: 'center',
        },
        innerCircle: {
            width: 15,
            height: 15,
            borderRadius: 15,
            backgroundColor: color(theme, 'icon_color')
        },
        text: {
            fontSize: 16,
            fontWeight: '700',
            color: color(theme, 'textPrimary')
        }
    });
}