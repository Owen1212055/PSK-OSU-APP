import React from 'react';
import {StyleSheet, Text, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';
import {BubbleFrame} from "@/components/newui/frame/OutlinedBubbleFrame";

interface PrimaryButtonProps extends TouchableOpacityProps {
    title: string;
}

export const RedirectButton: React.FC<PrimaryButtonProps> = ({ title, ...props }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <BubbleFrame {...props}>
            <Text style={styles.text}>{title} →</Text>
        </BubbleFrame>
    );
};

function createStyles(theme: Theme) {
    return StyleSheet.create({
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
