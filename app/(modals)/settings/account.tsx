import React, {use, useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View,} from 'react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';
import {SettingsPayload} from "@/api/Entities";
import APIService from "@/api/APIService";
import {ConfirmationHeader} from "@/components/newui/ConfirmationHeader";
import ProfilePicture from "@/components/newui/util/ProfilePicture";
import {ClickableThemedText} from "@/components/newui/input/ClickableThemedText";
import * as ImagePicker from "expo-image-picker";
import {TitledView} from "@/components/newui/TitledView";
import {InputBox} from "@/components/newui/input/InputBox";
import {RoundedInputBox} from "@/components/newui/input/RoundedInputBox";
import Constants from 'expo-constants';
import {SymbolButton} from "@/components/newui/input/SymbolButton";
import {RotateCcw} from "lucide-react-native";
import {router} from "expo-router"; // for keyboardVerticalOffset

export default function DashboardScreen() {

    const styles = useStyles(useTheme());
    const [profilePicture, setProfilePicture] = useState<string>();

    const [locallySetPfp, setLocallySetPfp] = useState<string | undefined>();
    const [username, setUsername] = useState<string | undefined>();
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();


    const refreshMe = async () => {
        const me = await APIService.me();

        setProfilePicture(me.profilePicture);
        setFirstName(me.firstName);
        setLastName(me.lastName)

        setUsername(me.username);
    };

    const update = async () => {
        if (locallySetPfp) {
            await APIService.uploadProfilePicture(locallySetPfp, 'image/jpeg');
        }

        if (firstName && lastName) {
            await APIService.updateSettings({firstName: firstName, lastName: lastName})
        }
        router.back();
    };

    const resetPassword = () => {
        router.push("./confirmpassword")
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

        setLocallySetPfp(uri);
    };

    return (
        <View style={styles.root}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ConfirmationHeader label={"Cancel"} on_done={update} />
                <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
                    <View style={styles.profile}>
                        <ProfilePicture
                            width={128}
                            height={128}
                            profilePictureData={profilePicture}
                            uriOverride={locallySetPfp}
                        />
                        <ClickableThemedText type={"navbar_location"} onPress={editPfp}>
                            Edit
                        </ClickableThemedText>
                    </View>

                    <View style={styles.options}>
                        <TitledView title={"First Name"} titleTheme={"title_new_chunky_subtext_heavy"}>
                            <RoundedInputBox defaultValue={firstName}/>
                        </TitledView>
                        <TitledView title={"Last Name"} titleTheme={"title_new_chunky_subtext_heavy"}>
                            <RoundedInputBox defaultValue={lastName}/>
                        </TitledView>
                        <TitledView title={"Username"} titleTheme={"title_new_chunky_subtext_heavy"}>
                            <RoundedInputBox defaultValue={username} editable={false}/>
                        </TitledView>
                        <TitledView title={"Password"} titleTheme={"title_new_chunky_subtext_heavy"}>
                            <SymbolButton onPress={resetPassword} title={"Change Password"} icon={<RotateCcw/>}/>
                        </TitledView>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        root: {
            flex: 1,
            gap: 16,
        },
        profile: {
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 8
        },
        scrollView: {
            backgroundColor: 'red'
        },
        options: {
            gap: 16
        }
    });
}