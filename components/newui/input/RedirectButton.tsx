import React from 'react';
import {StyleSheet, Text, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';

interface PrimaryButtonProps extends TouchableOpacityProps {
    title: string;
}

export const RedirectButton: React.FC<PrimaryButtonProps> = ({ title, ...props }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <TouchableOpacity style={styles.button} {...props}>
            <Text style={styles.text}>{title} →</Text>
        </TouchableOpacity>
    );
};

function createStyles(theme: Theme) {
    return StyleSheet.create({
        button: {
            display: 'flex',
            padding: 16,
            alignItems: 'center',
            borderRadius: 32,
            borderColor: 'rgba(0, 0, 0, 0.10)',
            borderWidth: 2,
            borderStyle: "solid",
        },
        text: {
            color: color(theme, 'textPrimary'),
            textAlign: 'center',
            fontFamily: 'Inter',
            fontSize: 16,
            fontWeight: '700',
            lineHeight: 20,
        }
    });
}
