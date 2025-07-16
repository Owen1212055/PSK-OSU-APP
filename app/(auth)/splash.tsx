import React from 'react';
import {Image, StyleSheet, useColorScheme, View,} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';
import {router} from "expo-router";
import {PrimaryButton} from "@/components/newui/input/PrimaryButton";
import Constants from "expo-constants";
import {VersionComponent} from "@/components/newui/VersionComponent";
import {useThemeCtx} from "@/contexts/ThemeProvider";

export default function SplashScreen() {

    const styles = useStyles(useTheme());

    const handleLogin = () => {
        router.push("/login")
    };

    let styledVersion = Constants.expoConfig?.version;
    if (Constants.expoConfig?.ios?.buildNumber === undefined) {
        styledVersion += " " + Constants.expoConfig?.ios?.buildNumber;
    }
    const { effective } = useThemeCtx();

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.content}>

                <View style={styles.login_area}>

                    <Image style={styles.image}
                           source={effective == 'light' ? require('../../assets/images/psk_title_black.png') : require('../../assets/images/psk_title.png')}/>
                    <PrimaryButton title="Sign in" onPress={handleLogin}/>
                </View>
                <View style={styles.footer}>
                    <VersionComponent hasIcon={false}/>
                </View>
            </View>
        </SafeAreaView>
    );
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: color(theme, 'background')
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