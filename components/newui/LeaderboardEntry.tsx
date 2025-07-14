import React from 'react';
import {StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View} from 'react-native';
import {color, inverseColor, Theme, useTheme} from '@/hooks/useThemeColor';
import {UserInfo} from "@/api/Entities";
import {ThemedText} from "@/components/ThemedText";
import ProfilePicture from "@/components/tiles/ProfilePicture";

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
                <ProfilePicture userId={brotherInfo.id}></ProfilePicture>
                <ThemedText style={styles.standing}>{brotherInfo.firstName}</ThemedText>
            </View>
            <ThemedText>{points}</ThemedText>
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
        text: {
            justifyContent: "space-between",
            alignItems: "center"
        },
        user: {
            gap: 16,
            flexDirection: "row",
            alignItems: "center"
        },
        standing: {
            paddingRight: 15
        }
    });
}
