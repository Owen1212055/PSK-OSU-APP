import React, {use, useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {color, inverseColor, Theme, useTheme} from '@/hooks/useThemeColor';
import {SettingsPayload, UserInfo} from "@/api/Entities";
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
import {Lock, Pencil, RotateCcw} from "lucide-react-native";
import {router} from "expo-router"; // for keyboardVerticalOffset

export default function DashboardScreen() {

    const styles = useStyles(useTheme());
    const [profilePicture, setProfilePicture] = useState<string>();

    const [locallySetPfp, setLocallySetPfp] = useState<string | undefined>();
    const [username, setUsername] = useState<string | undefined>();
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();

    const [meReference, setMeReference] = useState<UserInfo>();


    const refreshMe = async () => {
        const me = await APIService.me();

        setProfilePicture(me.profilePicture);
        setFirstName(me.firstName);
        setLastName(me.lastName)

        setUsername(me.username);
        setMeReference(me);
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
                        <View>
                            <ProfilePicture
                                user={meReference}
                                width={128}
                                height={128}
                                profilePictureData={profilePicture}
                                uriOverride={locallySetPfp}
                            />
                            <View style={styles.editIconHolder}>
                                <TouchableOpacity onPress={editPfp} >
                                    <Pencil color={styles.editIcon.color} strokeWidth={3.125}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ClickableThemedText type={"navbar_location"} onPress={editPfp}>
                            Edit
                        </ClickableThemedText>
                    </View>

                    <View style={styles.options}>
                        <TitledView title={"First Name"} titleTheme={"title_new_chunky_subtext_heavy"}>
                            <RoundedInputBox defaultValue={firstName} onChangeText={setFirstName}/>
                        </TitledView>
                        <TitledView title={"Last Name"} titleTheme={"title_new_chunky_subtext_heavy"}>
                            <RoundedInputBox defaultValue={lastName} onChangeText={setLastName}/>
                        </TitledView>
                        <TitledView title={"Username"} titleTheme={"subtitle_new_chunky_subtext_heavy"} headerIcon={
                            <Lock color={color(useTheme(), 'subtitle')} size={18} strokeWidth={2.5}/>
                        }>
                            <RoundedInputBox defaultValue={username} disabled={true}/>
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
        editIconHolder: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: inverseColor(theme, 'background'),
            borderColor: color(theme, 'background'),
            borderRadius: 40,
            borderWidth: 2.5,
            padding: 8.75,
            overflow: "hidden" // Trim the anti-aliased border around background
        },
        editIcon: {
            color: color(theme, 'background'),
        },
        scrollView: {

        },
        options: {
            gap: 16
        }
    });
}