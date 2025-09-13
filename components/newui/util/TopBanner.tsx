import React, { useEffect } from 'react';
import {Text, View, StyleSheet, ViewStyle} from 'react-native';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    Easing,
} from 'react-native-reanimated';
import {color, inverseColor, Theme, useTheme} from "@/hooks/useThemeColor";
import {SafeAreaView} from "react-native-safe-area-context";

interface TopBannerProps {
    message?: string;
    style?: ViewStyle;
    children?: React.ReactNode;
}

export const TopBanner: React.FC<TopBannerProps> = ({ message, style, children }) => {
    const styles = useStyles(useTheme());

    return (
        <SafeAreaView style={[styles.banner]} edges={["top", "left", "right"]}>
            <View style={[styles.banner_contents, style]}>
                {children ?? <Text style={styles.bannerText}>{message}</Text>}
            </View>
        </SafeAreaView>
    );
};

function useStyles(theme: Theme) {
    return StyleSheet.create({
        banner: {
            backgroundColor: color(theme, 'checkIn')
        },
        banner_contents: {
            backgroundColor: color(theme, 'checkIn'),
            paddingVertical: 12,
            paddingHorizontal: 16,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
        },
        bannerText: {
            color: inverseColor(theme, 'text'),
            fontWeight: 'bold',
            fontSize: 14,
        },
    });
}
