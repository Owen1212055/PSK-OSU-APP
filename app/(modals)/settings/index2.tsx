import React from 'react';
import {Image, StyleSheet, View,} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';
import {router} from "expo-router";
import {PrimaryButton} from "@/components/newui/input/PrimaryButton";
import {ThemedText} from "@/components/ThemedText";
import Constants from "expo-constants";

export default function IndexScreen() {

    const styles = useStyles(useTheme());

    const handleLogin = () => {
        router.push("/login")
    };

    let styledVersion = Constants.expoConfig?.version;
    if (Constants.expoConfig?.ios?.buildNumber === undefined) {
        styledVersion += " " + Constants.expoConfig?.ios?.buildNumber;
    }

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.content}>

                <View style={styles.login_area}>

                    <Image style={styles.image}/>
                    <PrimaryButton title="Sign in" onPress={handleLogin}/>
                </View>
                <View style={styles.footer}>
                    <ThemedText>{styledVersion}</ThemedText>
                </View>
            </View>
        </SafeAreaView>
    );
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: color(theme, 'background'),
            padding: 16
        },
        image: {
            marginTop: 363,
            width: 232.91,
            height: 122
        },
        content: {
            flex: 1,
            alignItems: "center",
        },
        login_area: {
            alignItems: "center",
            gap: 97
        },
        footer: {
            flex: 1,
            justifyContent: 'flex-end'
        }
    });
}