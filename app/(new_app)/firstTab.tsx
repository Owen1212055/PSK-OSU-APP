import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HomeScreen from '../(app)/index';
import Index from "@/app";
import InactiveEvent from "@/components/newui/event/InactiveEvent";
import {Theme, useTheme} from "@/hooks/useThemeColor";
import {ThemedText} from "@/components/ThemedText";
import EventTile from "@/components/newui/event/EventTile";
import {TitledView} from "@/components/newui/TitledView";

export default function FirstTab() {
    const styles = useStyles(useTheme());

    return (
        <View style={styles.root}>
            <InactiveEvent/>
            <TitledView title={"Upcoming"}>
                <View style={styles.events}>
                    <EventTile/>
                    <EventTile/>
                    <EventTile/>
                </View>
            </TitledView>
        </View>
    );
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        root: {
            flex: 1,
            gap: 24
        },
        events: {
            gap: 12
        }
    });
}
