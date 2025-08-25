import {StyleSheet, Text, View,} from 'react-native';
import {Theme, useTheme} from "@/hooks/useThemeColor";
import React, {useState} from "react";
import {ThemedText} from "@/components/ThemedText";
import {RequiredEventTag} from "@/components/newui/event/EventTags";
import {RedirectButton} from "@/components/newui/input/RedirectButton";
import {useFocusEffect} from "@react-navigation/native";
import APIService from "@/api/APIService";
import {ScoreResult} from "@/api/Entities";
import {BubbleCard} from "@/components/newui/frame/BubbleCard";

export default function AttendancePoints() {
    const theme = useTheme();
    const styles = useStyles(theme);

    const [score, setScore] = useState<ScoreResult>({min: 0, max: 0, percent: 0});

    useFocusEffect(
        React.useCallback(() => {
            APIService.me().then((me) => {
                APIService.getScore(me.id).then(score => {
                    setScore(score);
                })
            })

        }, [])
    );

    const percentage = score.percent >= 0 ? Math.floor(score.percent * 100) : 0;
    const scoreColor = getColorForPercentage(percentage);

    return (<BubbleCard>
        <View style={styles.container}>
            <View style={styles.text_header}>
                <View style={styles.percentageContainer}>
                    <Text style={[styles.points, { color: scoreColor }]}>{percentage}</Text>
                    <Text style={[styles.percentage, { color: scoreColor }]}>%</Text>
                </View>

                <View style={styles.header_mirror}>
                    {/*<RequiredEventTag/>*/}
                    <ThemedText>{score.min + "/" + score.max}</ThemedText>
                </View>
            </View>

            {/*<View style={styles.footer}>*/}
            {/*    <RedirectButton title={"View your point breakdown"}/>*/}
            {/*</View>*/}
        </View>
    </BubbleCard>)
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        container: {
            gap: 20
        },
        percentageContainer: {
            flexDirection: "row",
            alignItems: "baseline"
        },
        points: {
            fontSize: 40,
            fontWeight: 700,
        },
        percentage: {
            fontSize: 24,
            fontWeight: 700,
        },
        text_header : {
            alignSelf: "stretch",
            flexDirection: "row",
            justifyContent: 'space-between',
            gap: 16,
        },
        footer : {
            alignSelf: "stretch",
        },
        badge_content: {
            justifyContent: "center",
        },
        header_mirror: {
            alignItems: 'flex-end',
            gap: 4,
        }
    });
}


function lerpColor(color1: string, color2: string, t: number) {
    // Remove the '#' if present.
    color1 = color1.replace('#', '');
    color2 = color2.replace('#', '');
    const r1 = parseInt(color1.substring(0, 2), 16);
    const g1 = parseInt(color1.substring(2, 4), 16);
    const b1 = parseInt(color1.substring(4, 6), 16);
    const r2 = parseInt(color2.substring(0, 2), 16);
    const g2 = parseInt(color2.substring(2, 4), 16);
    const b2 = parseInt(color2.substring(4, 6), 16);
    const r = Math.round(r1 + t * (r2 - r1));
    const g = Math.round(g1 + t * (g2 - g1));
    const b = Math.round(b1 + t * (b2 - b1));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// Returns a color based on the percentage value.
function getColorForPercentage(percentage: number) {
    const green = '#39D32B';
    const yellow = '#FFFF00';
    const red = '#FF0000';

    if (percentage >= 90) {
        return green;
    } else if (percentage >= 85) {
        // t is 0 at 90 and 1 at 85.
        const t = (90 - percentage) / 5;
        return lerpColor(green, yellow, t);
    } else if (percentage >= 80) {
        // t is 0 at 85 and 1 at 80.
        const t = (85 - percentage) / 5;
        return lerpColor(yellow, red, t);
    } else {
        return red;
    }
}