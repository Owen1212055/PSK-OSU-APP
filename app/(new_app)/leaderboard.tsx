import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import AttendancePoints from "@/components/newui/points/AttendancePoints";
import {TitledView} from "@/components/newui/TitledView";
import {LeaderboardEntry} from "@/components/newui/LeaderboardEntry";
import APIService from "@/api/APIService";
import {GradedEventScoreboardEntry} from "@/api/Entities";
import {BubbleCard} from "@/components/newui/frame/BubbleCard";

import AssociatePointSubmitSheet, {
    LeaderboardDetailsSheetHandle
} from "@/components/newui/modal/AssociatePointSubmitSheet";
import {useFocusEffect} from '@react-navigation/native';

export default function Leaderboard() {
    const [scores, setScores] = useState<GradedEventScoreboardEntry[]>([]);
    const [associatePoints, setAssociatePoints] = useState<GradedEventScoreboardEntry[]>([]);
    const detailsRef = useRef<LeaderboardDetailsSheetHandle>(null);

    const refreshLeaderboards = useCallback(() => {
        APIService.getGradedEventsScoreboard().then(setScores);
        APIService.getAssociatePointsLeaderboard().then(setAssociatePoints);
    }, []);

    useEffect(() => {
        refreshLeaderboards();
    }, [refreshLeaderboards]);

    useFocusEffect(
        useCallback(() => {
            refreshLeaderboards();
        }, [refreshLeaderboards])
    );

    return (
        <View style={styles.root}>
            <TitledView title="Associates">
                <BubbleCard>
                    <View>
                        {associatePoints.map((entry, idx) => (
                            <View key={idx} style={styles.leaderboard_entry}>
                                <LeaderboardEntry
                                    points={entry.points}
                                    standing={entry.place}
                                    brotherInfo={entry.user}
                                    onPress={() => detailsRef.current?.open(entry)}
                                />
                            </View>
                        ))}
                    </View>
                </BubbleCard>
            </TitledView>

            <TitledView title="Attendance Points">
                <AttendancePoints/>
            </TitledView>

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

            <AssociatePointSubmitSheet ref={detailsRef}/>
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
});
