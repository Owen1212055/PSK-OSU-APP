import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import AttendancePoints from "@/components/newui/points/AttendancePoints";
import {TitledView} from "@/components/newui/TitledView";
import {LeaderboardEntry} from "@/components/newui/LeaderboardEntry";
import APIService from "@/api/APIService";
import {UserInfo} from "@/api/Entities";

export default function Leaderboard() {
    // TODO: REMOVE THIS
    const [me, setMe] = useState<UserInfo | null>(null);
    APIService.me().then((me) => {
        setMe(me);
    })

    return (
        <View style={styles.root}>
            <TitledView title="Attendance Points">
                <AttendancePoints/>
            </TitledView>

            <TitledView title="Leaderboard" subtitle="you suck! I hope u oof">
                {me && (
                    <View style={styles.leaderboard}>
                        {Array.from({length: 25}).map((_, idx) => (
                            <View key={idx} style={styles.leaderboard_entry}>
                                <LeaderboardEntry
                                    points={5}
                                    standing={idx + 1}
                                    brotherInfo={me}
                                />
                            </View>
                        ))}
                    </View>
                )}
            </TitledView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        gap: 24
    },
    leaderboard: {
        padding: 8
    },
    leaderboard_entry: {
        padding: 12
    },
    text: {fontSize: 18}
});
