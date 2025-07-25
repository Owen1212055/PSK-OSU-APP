import React from 'react';
import {StyleSheet, View} from 'react-native';
import {color, Theme, useTheme} from "@/hooks/useThemeColor";

export const BubbleFrame: React.FC<React.PropsWithChildren> = ({ children }) => {
    const styles= useStyles(useTheme());

    return <View style={styles.container}>{children}</View>;
};

function useStyles(theme: Theme) {
    return StyleSheet.create({
        container: {
            padding: 16,
            alignItems: 'center',
            borderRadius: 32,
            borderColor: theme.outer_background_color,
            borderWidth: 2,
            borderStyle: "solid",
        },
    });
}