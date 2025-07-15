import React from 'react';
import {StyleSheet, Text, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {color, inverseColor, Theme, useTheme} from '@/hooks/useThemeColor';

interface PrimaryButtonProps extends TouchableOpacityProps {
    title: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, ...props }) => {
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
            borderRadius: 32,
            backgroundColor: color(theme, 'accent'),
        },
        text: {
            color: inverseColor(theme, 'textPrimary'),
            textAlign: 'center',
            fontFamily: 'Inter',
            fontSize: 16,
            fontWeight: '700',
            lineHeight: 20,
        },
    });
}
