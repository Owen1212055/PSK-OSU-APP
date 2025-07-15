import {StyleSheet, View,} from 'react-native';
import {Theme, useTheme} from "@/hooks/useThemeColor";
import React from "react";
import {ThemedText} from "@/components/ThemedText";
import {RequiredEventTag} from "@/components/newui/event/EventTags";
import {RedirectButton} from "@/components/newui/input/RedirectButton";
import {BubbleCard} from "@/components/newui/BubbleCard";

export default function EventTile() {
    const theme = useTheme();
    const styles = useStyles(theme);

    return (<BubbleCard>
        <View style={styles.text_header}>
            <View style={styles.text_description}>
                <ThemedText type="subtitle">Cook out</ThemedText>
                <ThemedText>69696 lake house</ThemedText>
            </View>
            <View style={styles.header_mirror}>
                <ThemedText type="subtitle">Today</ThemedText>
                <ThemedText>high noon</ThemedText>
            </View>
        </View>

        <View style={styles.text_header}>
            <View style={styles.badge_content}>
                <RequiredEventTag/>
            </View>
            <View style={styles.header_mirror}>
                <RedirectButton title={"View Details"}/>
            </View>
        </View>
    </BubbleCard>)
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        text_header : {
            alignSelf: "stretch",
            flexDirection: "row",
            justifyContent: 'space-between',
            gap: 16,
        },
        badge_content: {
            justifyContent: "center",
        },
        icons : {
            alignSelf: "stretch",
            flexDirection: "row",
            justifyContent: 'space-between',
            gap: 16,
        },
        text_description: {
            gap: 4,
        },
        header_mirror: {
            alignItems: 'flex-end',
            gap: 4,
        }
    });
}
