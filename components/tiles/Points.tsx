import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import {CircleAlertIcon, CircleCheck} from 'lucide-react-native';
import { useFocusEffect } from "@react-navigation/native";
import APIService from "@/api/APIService";
import {ScoreResult} from "@/api/Entities";

// Helper to linearly interpolate between two hex colors.
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

export function Points() {
  const [score, setScore] = useState<ScoreResult>({min: 0, max: 0, percent: 0});

  useFocusEffect(
      React.useCallback(() => {
        const fetchUser = async () => {
          const userScore = await APIService.getScore((await APIService.me()).id);
          setScore(userScore);
        };

        fetchUser();
      }, [])
  );

  // Multiply score by 100 and truncate decimals.
  const percentage = 100;
  const scoreColor = getColorForPercentage(percentage);
  const icon = percentage > 80 ? (<CircleCheck strokeWidth={2} color={scoreColor} size={40} />) : (<CircleAlertIcon strokeWidth={2} color={scoreColor} size={40} />);
  const message = percentage > 80 ? "You are within the threshold for points." : "You are not within the threshold for points.";

  return (
      <View style={styles.pointsBase}>
        {/* Header Section */}
        <View style={styles.pointsHeader}>
          <ThemedText style={styles.pointsTitle}>Attendance Points</ThemedText>
          <ThemedText style={styles.pointsSubtitle}>
            {message}
          </ThemedText>
        </View>

        {/* Score Section */}
        <View style={styles.scoreSection}>
          <View style={styles.iconBox}>
            {icon}
          </View>
          <View style={styles.scoreText}>
            <ThemedText style={[styles.scoreValue, { color: scoreColor }]}>
              {`${percentage}`}
            </ThemedText>
            <ThemedText style={[styles.scoreUnit, { color: scoreColor }]}>
              %
            </ThemedText>
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  pointsBase: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  pointsHeader: {},
  pointsTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  pointsSubtitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    marginRight: 10,
  },
  scoreText: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 35,
    fontWeight: '700',
    marginRight: 4,
  },
  scoreUnit: {
    fontSize: 16,
    fontWeight: '400',
  },
});
