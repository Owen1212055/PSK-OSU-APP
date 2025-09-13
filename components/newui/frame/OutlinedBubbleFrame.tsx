import React from 'react';
import { StyleSheet, View } from 'react-native';
import { color, Theme, useTheme } from "@/hooks/useThemeColor";

type BubbleFrameProps = React.PropsWithChildren<{
    variant?: 'normal' | 'tight';
}>;

export const BubbleFrame: React.FC<BubbleFrameProps> = ({ children, variant = 'normal' }) => {
    const styles = useStyles(useTheme());

    return <View style={[styles.container, styles[variant]]}>{children}</View>;
};

function useStyles(theme: Theme) {
    return StyleSheet.create({
        container: {
            alignItems: 'center',
            borderRadius: 32,
            borderColor: theme.outer_background_color,
            borderWidth: 2,
            borderStyle: "solid",
        },
        normal: {
            paddingVertical: 16,
            paddingHorizontal: 12,
        },
        tight: {
            paddingVertical: 8,
            paddingHorizontal: 12,
        },
    });
}