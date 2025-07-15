// SettingsScreen.tsx
import React, {useEffect, useState} from 'react';
import {Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {ThemedText} from "@/components/ThemedText";
import {UserInfo} from "@/api/Entities";
import APIService from "@/api/APIService";
import {usePredefined} from "@/hooks/useThemeColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";
import ChangeProfilePicButton from "@/components/tiles/ChangeProfilePicButton";

export default function SettingsScreen() {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [id, setId] = useState<number>(-1);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userInfo: UserInfo = await APIService.me();
                setFirstName(userInfo.firstName);
                setLastName(userInfo.lastName);
                setId(userInfo.id);
            } catch (error) {
                console.error('Error fetching user info', error);
            }
        };
        fetchUser();
    }, []);

    // Retrieve themed colors
    const bubbleBackground = usePredefined('bubble_background');
    const textColor = usePredefined('text');
    const specialButton = usePredefined('special_button');
    const borderColor = usePredefined('border_color');

    const handleSave = () => {
        if (firstName && lastName) {
            APIService.updateSettings({firstName, lastName})
                .then((me: UserInfo) => {
                    setFirstName(me.firstName);
                    setLastName(me.lastName);
                    Keyboard.dismiss();
                })
        }
    };

    const onLogout = () => {
        AsyncStorage.removeItem('token').then(r => {
            router.replace("/(auth)/splash")
        });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View>
                <View style={[styles.formSection, {backgroundColor: bubbleBackground}]}>
                    <ThemedText type="title">Settings</ThemedText>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, {color: textColor}]}>First Name</Text>
                        <TextInput
                            style={[styles.input, {backgroundColor: bubbleBackground, color: textColor, borderColor}]}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="First Name"
                            placeholderTextColor={textColor}
                            keyboardType={"ascii-capable"}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, {color: textColor}]}>Last Name</Text>
                        <TextInput
                            style={[styles.input, {backgroundColor: bubbleBackground, color: textColor, borderColor}]}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Last Name"
                            placeholderTextColor={textColor}
                            keyboardType={"ascii-capable"}
                        />
                    </View>

                    <TouchableOpacity style={[styles.saveButton, {backgroundColor: specialButton}]}
                                      onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>

                <ChangeProfilePicButton></ChangeProfilePicButton>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formSection: {
        borderRadius: 10,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inputGroup: {
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 16,
    },
    saveButton: {
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
