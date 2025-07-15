import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View,} from 'react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';
import {router} from "expo-router";
import Constants from "expo-constants";
import {UserInfo} from "@/api/Entities";
import APIService from "@/api/APIService";
import {useFocusEffect} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ConfirmationHeader} from "@/components/newui/ConfirmationHeader";
import ProfilePicture from "@/components/newui/util/ProfilePicture";
import {ClickableThemedText} from "@/components/newui/input/ClickableThemedText";
import * as ImagePicker from "expo-image-picker";

export default function DashboardScreen() {

    const styles = useStyles(useTheme());

    const [profilePicture, setProfilePicture] = useState<string>();
    const [profilePictureUri, setProfilePictureUi] = useState<string>();

    const refreshMe = async () => {
        const me = await APIService.me();

        setProfilePicture(me.profilePicture);
    };

    const update = async () => {
        if (profilePictureUri) {
            await APIService.uploadProfilePicture(profilePictureUri, 'image/jpeg');
        }
    };



    useEffect(() => {
        refreshMe();
    }, []);


    const editPfp = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.5,
            allowsEditing: true,
            aspect: [1, 1],

        });
        if (result.canceled) {
            return;
        }

        const asset = result.assets[0];
        const uri = asset.uri;

        setProfilePictureUi(uri);
    };


    return (
        <View style={styles.root}>
            <ConfirmationHeader label={"Cancel"} on_done={update}/>
            <View style={styles.profile}>
                <ProfilePicture width={128} height={128} profilePictureData={profilePicture} uriOverride={profilePictureUri}/>
                <ClickableThemedText type={"navbar_location"} onPress={editPfp}>Edit</ClickableThemedText>
            </View>
        </View>
    );
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: color(theme, 'background'),
            padding: 16,
            gap: 16
        },
        profile: {
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 8
        }
    });
}