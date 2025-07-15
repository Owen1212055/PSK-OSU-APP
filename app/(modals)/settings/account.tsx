import React, {useState} from 'react';
import {StyleSheet, View,} from 'react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';
import {router} from "expo-router";
import Constants from "expo-constants";
import {UserInfo} from "@/api/Entities";
import APIService from "@/api/APIService";
import {useFocusEffect} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ConfirmationHeader} from "@/components/newui/ConfirmationHeader";

export default function DashboardScreen() {

    const styles = useStyles(useTheme());

    const handleLogin = () => {
        router.push("/settings/index2")
    };

    let styledVersion = Constants.expoConfig?.version;
    if (Constants.expoConfig?.ios?.buildNumber === undefined) {
        styledVersion += " " + Constants.expoConfig?.ios?.buildNumber;
    }


    const [me, setMe] = useState<UserInfo | null>(null);
    useFocusEffect(() => {
        APIService.me().then((me) => {
            setMe(me);
        })
    });

    if (!me?.id) {
        return (
            <View style={styles.root}>

            </View>
        );
    }

    const logOut = () => {
        AsyncStorage.removeItem('token').then(r => {
            router.replace("/(auth)/splash")
        });
    };


    return (
        <View style={styles.root}>
            <ConfirmationHeader label={"Cancel"}/>

        </View>
    );
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: color(theme, 'background'),
            padding: 16,
            justifyContent: "space-between"
        },
        profile: {
            paddingVertical: 16,
            paddingHorizontal: 8,
            gap: 16,
            flexDirection: "row",
            alignItems: "stretch"
        },
        profile_name: {
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 4
        },
        buttons: {
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 8,
            alignSelf: "stretch"
        },
        footer: {
            flex: 1,
            justifyContent: 'flex-end',
            paddingVertical: 48,
            gap: 32
        }
    });
}