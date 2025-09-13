import React from 'react';
import {StyleSheet, View} from 'react-native';
import {color, Theme, useTheme} from "@/hooks/useThemeColor";

export const BubbleCard: React.FC<React.PropsWithChildren> = ({ children }) => {
    const styles= useStyles(useTheme());

    return <View style={styles.container}>{children}</View>;
};

function useStyles(theme: Theme) {
    return StyleSheet.create({
        container: {
            padding: 20,

            borderRadius: 20,
            backgroundColor: color(theme, "card")
        }
    });
}
