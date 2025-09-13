import React, {useState} from 'react';
import {Alert, GestureResponderEvent, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {EyeIcon, EyeOffIcon} from 'lucide-react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';
import AuthService from "@/api/APIService";
import {router} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {InputBox} from "@/components/newui/input/InputBox";
import {PrimaryButton} from "@/components/newui/input/PrimaryButton";
import {ThemedText} from "@/components/ThemedText";
import {ContentCard} from '@/components/newui/frame/ContentCard';
import {NavBar} from "@/components/newui/input/NavBar";

export default function SignInScreen() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invite, setInvite] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: GestureResponderEvent) => {
        e.preventDefault();

        AuthService.register({
            username: username,
            password: password,
            inviteCode: invite
        }).then((res) => {
            AsyncStorage.setItem('token', res.data.token);
            router.replace("/(new_app)/events")
        }).catch((res) => {
            Alert.alert('Login Failure!', 'Failed to register: ' + res.response.data.message);
        });
    };

    const styles = useStyles(useTheme());

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.content}>

                <NavBar label="Back"/>

                <ThemedText type={"title_new"}>Sign Up</ThemedText>

                <View style={styles.login_area}>
                    <ContentCard>
                        <InputBox
                            label="Name.#"
                            keyboardType="ascii-capable"
                            placeholder="Enter your Name.#"
                            onChangeText={setUsername}
                        />

                        <InputBox
                            label={"Password"}
                            placeholder={"Enter your Password"}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            textContentType="password"
                            trailing={
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <EyeIcon color={styles.icon.color} width={24} height={24}/>
                                    ) : (
                                        <EyeOffIcon color={styles.icon.color} width={24} height={24}/>
                                    )}
                                </TouchableOpacity>
                            }
                        />

                        <InputBox
                            label="Invite Code"
                            keyboardType="ascii-capable"
                            placeholder="Enter your Invite Code"
                            onChangeText={setInvite}
                        />

                    </ContentCard>
                    <PrimaryButton title="Sign Up" onPress={handleLogin}/>

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
        content: {
            paddingHorizontal: 16,
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            alignSelf: "stretch",
            gap: 32,
            paddingVertical: 8
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
            gap: 32,
            alignSelf: "stretch",
        },
        icon: {
            color: color(theme, 'icon_color'),
        }
    });
}
