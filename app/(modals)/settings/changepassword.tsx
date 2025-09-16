import React, {useState} from 'react';
import {Alert, StyleSheet, View,} from 'react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';
import {PrimaryButton} from "@/components/newui/input/PrimaryButton";
import {ThemedText} from "@/components/ThemedText";
import {NavBar} from "@/components/newui/input/NavBar";
import {RoundedInputBox} from "@/components/newui/input/RoundedInputBox";
import {router, useLocalSearchParams} from "expo-router";
import AuthService from "@/api/APIService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {CircleCheck} from "lucide-react-native";

export default function ConfirmPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { currentPassword } = useLocalSearchParams<{ currentPassword: string }>();

    const handleConfirm = () => {
        AuthService.changePassword({
            password: currentPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
        }).then(async (res) => {
            await AsyncStorage.setItem('token', res);

            router.dismissTo('./account');
            Alert.alert('Login Success!', "Password has been changed!");
        }).catch((res) => {
            Alert.alert('Login Failure!', 'Failed to reset password: ' + res.response.data);
        });
    };



    const styles = useStyles(useTheme());

    return (
        <View style={styles.root}>
            <NavBar label="Back" title={"Password"}/>

            <ThemedText type={"title_new_chunky"}>Choose a new password</ThemedText>

            <View style={styles.login_area}>
                <RoundedInputBox secureTextEntry={true} placeholder={"New Password"} onChangeText={setNewPassword}/>
                <View style={styles.confirm_password_holder}>
                    <RoundedInputBox secureTextEntry={true} placeholder={"Confirm Password"} onChangeText={setConfirmPassword}/>
                    <View style={styles.confirm_password_text}>
                        <CircleCheck color={color(useTheme(), 'subtitle')} strokeWidth={2.5} size={18}/>
                        <ThemedText type={"subtitle_new_chunky_subtext_heavy"}>Must match previous password</ThemedText>
                    </View>
                </View>

                <PrimaryButton title="Confirm" onPress={handleConfirm}/>
            </View>
        </View>
    );
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        root: {
            gap: 16
        },
        navbar: {
            height: 40,
            paddingHorizontal: 4,
            justifyContent: "space-between",
            alignItems: "flex-start",
            alignSelf: "stretch",
        },
        confirm_password_holder: {
            alignSelf: "stretch",
            gap: 4
        },
        confirm_password_text: {
            gap: 4,
            alignItems: "center",
            flexDirection: "row"
        },
        login_area: {
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 16,
            alignSelf: "stretch"
        }
    });
}