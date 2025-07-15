import React, {useEffect} from 'react';
import {router} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIService from "@/api/APIService";
import {ActivityIndicator, Alert, View} from "react-native";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function Index() {
    useEffect(() => {
        AsyncStorage.getItem('token').then((token) => {
            if (!token) {
                router.replace('/(auth)/splash');
                return Promise.resolve();
            } else {
                return APIService.me().then((data) => {
                    router.replace('/(new_app)/events');
                }).catch((error) => {
                    Alert.alert('Login Failure!', 'Failed to login: ' + error.message);
                    router.replace('/(auth)/splash');
                })
            }
        }).finally(() => {
            SplashScreen.hide();
        })

    }, []);

    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator/>
        </View>
    );
}
