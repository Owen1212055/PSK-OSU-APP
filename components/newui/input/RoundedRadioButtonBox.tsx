import React from 'react';
import type {TextStyle, ViewStyle} from 'react-native';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';
import { BubbleFrame } from '../frame/OutlinedBubbleFrame';


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
            onPress={onToggle}
            accessibilityRole="radio"
            accessibilityState={{selected: active}}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
        >
            <BubbleFrame>
                <View style={styles.container}>
                    <View style={styles.outerCircle}>
                        {active && <View style={styles.innerCircle}/>}
                    </View>

                    <Text style={[styles.text, labelStyle]}>{label}</Text>
                </View>
            </BubbleFrame>
        </TouchableOpacity>
    );
};

function createStyles(theme: Theme) {
    return StyleSheet.create({
        container: {
            flexDirection: "row",
            gap: 16,
            alignSelf: "stretch",
            alignItems: "center"
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