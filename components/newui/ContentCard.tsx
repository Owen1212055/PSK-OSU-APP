import React from 'react';
import {StyleSheet, View} from 'react-native';
import {color, Theme, useTheme} from "@/hooks/useThemeColor";

export const ContentCard: React.FC<React.PropsWithChildren> = ({ children }) => {
    const styles= useStyles(useTheme());

    return <View style={styles.container}>{children}</View>;
};

function useStyles(theme: Theme) {
    return StyleSheet.create({
        container: {
            display: "flex",
            padding: 16,
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 32,
            alignSelf: "stretch",
            borderRadius: 16,
            backgroundColor: color(theme, 'card'),
        }
    });
}
