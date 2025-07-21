import {StyleSheet, View,} from 'react-native';
import {Theme, useTheme} from "@/hooks/useThemeColor";
import React from "react";
import {ThemedText} from "@/components/ThemedText";
import {RedirectButton} from "@/components/newui/input/RedirectButton";
import {BubbleCard} from "@/components/newui/frame/BubbleCard";
import {PrimaryButton} from "@/components/newui/input/PrimaryButton";
import {FancyCheckInButton} from "@/components/newui/input/FancyCheckInButton";

interface EventTileProps {
    badge: React.ReactNode;
    date: string;
    time: string;
    title: string;
    location: string;
    startTime: Date;
}

export const ActiveEventTile: React.FC<EventTileProps> = ({
                                                              badge,
                                                              date,
                                                              time,
                                                              title,
                                                              location,
                                                              startTime,
                                                          }) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        <BubbleCard>
            <View style={styles.container}>
                <View style={styles.text_header}>
                    <View style={styles.text_description}>
                        <ThemedText type="subtitle">{title}</ThemedText>
                        <ThemedText>{location}</ThemedText>
                    </View>
                    <View style={styles.header_mirror}>
                        <ThemedText type="subtitle">{date}</ThemedText>
                        <ThemedText>{time}</ThemedText>
                    </View>
                </View>
                <ThemedText>Starts in </ThemedText>

                <View style={styles.buttons}>
                    <FancyCheckInButton title={"I'm here!"}/>
                    <RedirectButton title="Show Event Details"/>
                </View>
            </View>
        </BubbleCard>
    );
};

function useStyles(theme: Theme) {
    return StyleSheet.create({
        container: {
            gap: 48
        },
        text_header: {
            alignSelf: "stretch",
            flexDirection: "row",
            justifyContent: 'space-between',
            gap: 16
        },
        buttons: {
            gap: 16
        },
        badge_content: {
            justifyContent: "center",
        },
        icons: {
            alignSelf: "stretch",
            flexDirection: "row",
            justifyContent: 'space-between',
            gap: 16,
        },
        text_description: {
            gap: 4,
            flexShrink: 1
        },
        header_mirror: {
            alignItems: 'flex-end',
            gap: 4
        }
    });
}
