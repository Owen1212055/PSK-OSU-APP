import React from 'react';
import {GestureResponderEvent, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Theme, useTheme} from '@/hooks/useThemeColor';
import {UserInfo} from "@/api/Entities";
import {ThemedText} from "@/components/ThemedText";
import ProfilePicture from "@/components/newui/util/ProfilePicture";
import {BubbleFrame} from "@/components/newui/frame/OutlinedBubbleFrame";

interface LeaderboardEntryProps {
    standing: number;
    points: number;
    brotherInfo: UserInfo;
    onPress?: (event: GestureResponderEvent) => void;
}

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({ standing, points, brotherInfo, onPress }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const pointElement = <ThemedText type={'title_new_chunky_subtext_heavy'}>{points}</ThemedText>;

    return (
        <View style={styles.container}>
            <View style={styles.user}>
                <ThemedText style={styles.standing}>{standing}</ThemedText>
                <View style={styles.labels}>
                    <ProfilePicture user={brotherInfo}></ProfilePicture>
                    <ThemedText type={'content_header'} >{brotherInfo.firstName ? brotherInfo.firstName : brotherInfo.username}</ThemedText>
                </View>
            </View>
            {onPress ? <TouchableOpacity onPress={onPress}><BubbleFrame variant={"tight"}>{pointElement}</BubbleFrame></TouchableOpacity> : pointElement}
        </View>
    );
};

function createStyles(theme: Theme) {
    return StyleSheet.create({
        container: {
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row"
        },
        user: {
            gap: 16,
            flexDirection: "row",
            alignItems: "center"
        },
        labels: {
            gap: 8,
            flexDirection: "row",
            alignItems: "center"
        },
        standing: {
            width: 19,
            textAlign: "right",
            justifyContent: "flex-end"
        }
    });
}
