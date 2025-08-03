import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Theme, useTheme} from '@/hooks/useThemeColor';
import {UserInfo} from "@/api/Entities";
import {ThemedText} from "@/components/ThemedText";
import ProfilePicture from "@/components/newui/util/ProfilePicture";

interface LeaderboardEntryProps {
    standing: number;
    points: number;
    brotherInfo: UserInfo;
}

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({ standing, points, brotherInfo }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.user}>
                <ThemedText style={styles.standing}>{standing}</ThemedText>
                <View style={styles.labels}>
                    <ProfilePicture user={brotherInfo}></ProfilePicture>
                    <ThemedText type={'content_header'} >{brotherInfo.firstName ? brotherInfo.firstName : brotherInfo.username}</ThemedText>
                </View>
            </View>
            <ThemedText type={'title_new_chunky_subtext_heavy'}>{points}</ThemedText>
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
