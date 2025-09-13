import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import AttendancePoints from "@/components/newui/points/AttendancePoints";
import {TitledView} from "@/components/newui/TitledView";
import {LeaderboardEntry} from "@/components/newui/LeaderboardEntry";
import APIService from "@/api/APIService";
import {GradedEventScoreboardEntry, UserInfo} from "@/api/Entities";
import {BubbleCard} from "@/components/newui/frame/BubbleCard";

export default function AssociatePointLeaderboard() {
    const [scores, setScores] = useState<GradedEventScoreboardEntry[]>([]);
    useEffect(() => {
        APIService.getAssociatePointsLeaderboard().then((me) => {
            setScores(me);
        });
    }, []);

    return (
        <View style={styles.root}>
            <TitledView title="Leaderboard">
                <BubbleCard>
                    <View>
                        {scores.map((entry, idx) => (
                            <View key={idx} style={styles.leaderboard_entry}>
                                <LeaderboardEntry
                                    points={entry.points}
                                    standing={entry.place}
                                    brotherInfo={entry.user}
                                />
                            </View>
                        ))}
                    </View>
                </BubbleCard>
            </TitledView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        gap: 24
    },
    leaderboard_entry: {
        padding: 12
    },
    text: {fontSize: 18}
});
