import {Image, StyleSheet, View,} from 'react-native';
import {Theme, useTheme} from "@/hooks/useThemeColor";
import React from "react";
import {ThemedText} from "@/components/ThemedText";

export default function InactiveEvent() {
    const styles = useStyles(useTheme());

    return (<View style={styles.root}>
        <View style={styles.no_motion_ocean}>
            <View style={styles.tumbleweed}>
                <View style={styles.tumbleweed_box}>
                    <View style={styles.tumbleweed_innerbox}>
                        <Image source={require('../../../assets/images/tumbleweed.png')}/>
                        <ThemedText type="title_new_chunky">... no motion</ThemedText>
                    </View>
                    <ThemedText type="title_new_chunky_subtext" style={styles.subtitle}>You’ll get notified when it’s
                        time to check in to an event</ThemedText>
                </View>
            </View>
        </View>
    </View>)
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        root: {},

        no_motion_ocean: {
            height: 220,
            alignSelf: 'stretch',
            justifyContent: 'center',
        },
        tumbleweed: {
            padding: 24,
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'center',
        },
        tumbleweed_box: {
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
        },
        tumbleweed_innerbox: {
            alignItems: 'center',
        },
        subtitle: {
            textAlign: 'center',
            width: 184 // TODO: :(
        },
    });
}
