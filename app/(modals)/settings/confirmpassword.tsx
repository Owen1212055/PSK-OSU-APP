import React, {useState} from 'react';
import {Alert, GestureResponderEvent, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {EyeIcon, EyeOffIcon} from 'lucide-react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';
import AuthService from "@/api/APIService";
import {router, useLocalSearchParams} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {InputBox} from "@/components/newui/input/InputBox";
import {PrimaryButton} from "@/components/newui/input/PrimaryButton";
import {ThemedText} from "@/components/ThemedText";
import {ContentCard} from '@/components/newui/frame/ContentCard';
import {NavBar} from "@/components/newui/input/NavBar";
import {ClickableThemedText} from "@/components/newui/input/ClickableThemedText";
import {RoundedInputBox} from "@/components/newui/input/RoundedInputBox";

export default function ConfirmPassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const handleConfirmationPage = async (e: GestureResponderEvent) => {
    };

    const signUp = () => {
        router.push({
            pathname: "./changepassword",
            params: { currentPassword }
        });
    };

    const styles = useStyles(useTheme());

    return (
        <View style={styles.root}>
            <NavBar label="Back" title={"Password"}/>

            <ThemedText type={"title_new_chunky"}>Confirm your current password</ThemedText>

            <View style={styles.login_area}>
                <RoundedInputBox secureTextEntry={true} onChangeText={setCurrentPassword} placeholder={"Current Password"}/>
                <PrimaryButton title="Next" onPress={signUp}/>
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
        login_area: {
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 16,
            alignSelf: "stretch"
        }
    });
}