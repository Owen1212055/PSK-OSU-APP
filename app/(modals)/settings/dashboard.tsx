import React, {useEffect, useState} from 'react';
import {StyleSheet, View,} from 'react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';
import {router} from "expo-router";
import Constants from "expo-constants";
import {NavBar} from "@/components/newui/input/NavBar";
import ProfilePicture from "@/components/newui/util/ProfilePicture";
import {Role, UserInfo} from "@/api/Entities";
import APIService from "@/api/APIService";
import {useFocusEffect} from "@react-navigation/native";
import {ThemedText} from "@/components/ThemedText";
import {SymbolButton} from "@/components/newui/input/SymbolButton";
import {BellRing, Brush, CircleUserRound, HandPlatter, HandPlatterIcon, LogOut} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {VersionComponent} from "@/components/newui/VersionComponent";

export default function DashboardScreen() {

    const styles = useStyles(useTheme());
    const [me, setMe] = useState<UserInfo | null>(null);

    useFocusEffect(
        React.useCallback(() => {
            APIService.me().then((me) => {
                setMe(me);
            })
        }, [])
    );

    const logOut = () => {
        AsyncStorage.removeItem('token').then(r => {
            router.replace("/(auth)/splash")
        });
    };


    const accountSettings = () => {
        router.push("./account")
    };
    const appearance = () => {
        router.push("./appearance")
    };
    const adminPanel = () => {
        router.push("./adminpanel")
    };



    return (
        <View style={styles.root}>
            <NavBar title={"Settings"} popup={true}/>
            {
                me &&
                <View style={styles.profile}>
                    <ProfilePicture width={64} height={64} user={me}></ProfilePicture>
                    <View style={styles.profile_name}>
                        <ThemedText type={"profile_name"}>{
                            me.firstName == null || me.lastName == null ? me.username : (me.firstName + " " + me.lastName)
                        }</ThemedText>
                        <ThemedText type={"profile_username"}>{me.username}</ThemedText>
                    </View>
                </View>
            }
            <View style={styles.buttons}>
                <SymbolButton icon={<CircleUserRound/>} title={"Account"}
                              subtitle={"Manage your name, photo, and password"}
                              onPress={accountSettings}></SymbolButton>
                {/*<SymbolButton icon={<BellRing/>} title={"Notifications"}*/}
                {/*              subtitle={"Set your notification boundaries"}></SymbolButton>*/}
                <SymbolButton icon={<Brush/>} title={"Appearance"}
                              onPress={appearance} subtitle={"Change the look of the app"}></SymbolButton>
                {
                    me?.roles.includes(Role.EXEC)
                    && <SymbolButton icon={<HandPlatter/>} title={"Administration"} onPress={adminPanel} subtitle={"Open the administration menu, cool kids only!"}></SymbolButton>
                }
            </View>
            <View style={styles.footer}>
                <SymbolButton icon={<LogOut/>} title={"Sign Out"} onPress={logOut}></SymbolButton>
                <VersionComponent/>
            </View>
        </View>
    );
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        root: {
            flex: 1,
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