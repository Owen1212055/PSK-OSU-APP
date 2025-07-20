import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';
import Constants from "expo-constants";


interface VersionProperties {
    hasIcon?: boolean;
}

export const VersionComponent: React.FC<VersionProperties> = ({ hasIcon = true }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    let styledVersion = Constants.expoConfig?.version;
    const rawHash = Constants.expoConfig?.extra?.commitHash ?? '';
    const shortHash = rawHash.slice(0, 7);
    styledVersion += " | " + shortHash;

    return (
        <View style={styles.container}>
            {hasIcon && <Image style={styles.image} source={require('../../assets/images/psk_title_gray.png')}/>}
            <Text style={styles.text}>{styledVersion}</Text>
        </View>
    );
};

function createStyles(theme: Theme) {
    return StyleSheet.create({
        container: {
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
            flexDirection: 'column',
            gap: 10
        },
        image: {
            width: 64,
            height: 34
        },
        text: {
            fontSize: 12,
            fontWeight: "500",
            lineHeight: 18,
            color: color(theme, 'subtitle')
        }
    });
}
