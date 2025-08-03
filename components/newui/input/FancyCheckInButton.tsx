import React from 'react';
import {StyleSheet, Text, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {color, inverseColor, Theme, useTheme} from '@/hooks/useThemeColor';

interface PrimaryButtonProps extends TouchableOpacityProps {
    title: string;
}

export const FancyCheckInButton: React.FC<PrimaryButtonProps> = ({ title, ...props }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <TouchableOpacity style={styles.button} {...props}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

function createStyles(theme: Theme) {
    return StyleSheet.create({
        button: {
            display: 'flex',
            paddingVertical: 16,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'stretch',
            borderRadius: 48,
            backgroundColor: color(theme, 'checkIn'),

            boxShadow: [
                {offsetX: 0, offsetY: 5, blurRadius: 8, spreadDistance: 0, inset: true, color: color(theme, 'inner_shadow_shine')},
                {offsetX: 0, offsetY: -5, blurRadius: 8, spreadDistance: 0, inset: true, color: color(theme, 'content_header_border')},
            ]
        },
        text: {
            color: inverseColor(theme, 'textPrimary'),
            textAlign: 'center',
            fontFamily: 'Inter',
            fontSize: 24,
            fontWeight: '700'
        },
    });
}
