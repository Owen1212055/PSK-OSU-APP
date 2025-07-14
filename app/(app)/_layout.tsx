import { Redirect, Stack, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {ActivityIndicator, Alert, Platform} from 'react-native';
import { House, SettingsIcon, Users } from 'lucide-react-native';
import APIService from "@/api/APIService";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Main component
export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Tabs
                screenOptions={{
                    headerShown: true,
                    tabBarStyle: Platform.select({
                        ios: { position: 'absolute' },
                        default: {},
                    }),
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => <House color={color} size={28} />,
                    }}
                />
                <Tabs.Screen
                    name="adminpanel"
                    options={{
                        title: 'Admin Panel',
                        tabBarIcon: ({ color }) => <Users color={color} size={28} />,
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        tabBarIcon: ({ color }) => <SettingsIcon color={color} size={28} />,
                        headerShown: false,
                    }}
                />
            </Tabs>
        </ThemeProvider>
    );
}