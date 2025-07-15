import React from 'react';
import {StyleSheet, View} from 'react-native';
import InactiveEvent from "@/components/newui/event/InactiveEvent";
import {Theme, useTheme} from "@/hooks/useThemeColor";
import EventTile from "@/components/newui/event/EventTile";
import {TitledView} from "@/components/newui/TitledView";

export default function Events() {
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
