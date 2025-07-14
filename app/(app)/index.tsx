import React, {useEffect} from 'react';
import { View } from 'react-native';

import StaticScrollPane from '@/components/StaticScrollPane';
import { CurrentEvent } from '@/components/tiles/CurrentEvent';
import { Points } from '@/components/tiles/Points';
import { PledgePoints } from '@/components/tiles/pledgepoints/PledgePoints';

import { usePredefined } from '@/hooks/useThemeColor';
import { StyleSheet } from 'react-native';
import {Role} from "@/api/Entities";

export default function HomeScreen() {
    const bubbleBackground = usePredefined('bubble_background');

    return (
        <View>
            {/* Row 1: Single item (Title) */}

            {/* Row 2: Single big item (CurrentEvent) */}
            <View style={styles.rowSingle}>
                <View style={[styles.card_big, { backgroundColor: bubbleBackground }]}>
                    <CurrentEvent />
                </View>
            </View>

            {/* Row 3: Two small items side by side (Points + empty) */}
            <View style={styles.rowDouble}>
                <View style={[styles.card_small, { backgroundColor: bubbleBackground }]}>
                    <Points />
                </View>
                <View style={[styles.card_small, { backgroundColor: bubbleBackground }]}>
                    {/* Could place another small tile here, or leave empty */}
                </View>
            </View>

            {/* Row 4: Single big item (PledgePoints) */}
            <View style={styles.rowSingle}>
                <View style={[styles.card_big, { backgroundColor: bubbleBackground }]}>
                    <PledgePoints />
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    /**
     * Row with a single wide item
     */
    rowSingle: {
        marginBottom: 10,       // Space between this row and the next
        width: '100%',
        flexDirection: 'row'
    },

    /**
     * Row with two small items side-by-side
     */
    rowDouble: {
        marginBottom: 10,       // Same vertical spacing as rowSingle
        width: '100%',
        flexDirection: 'row',
        /**
         * gap = 10 ensures the small cards have 10px space
         * between them horizontally. This matches the marginBottom
         * and horizontal padding for consistency.
         */
        gap: 10
    },

    /**
     * Big card: full width of the row
     */
    card_big: {
        flex: 1,
        minHeight: 165,
        width: '100%',
        borderRadius: 15,
        padding: 10,
    },

    /**
     * Small card: half width (with gap)
     * Using flex: 1 so that each tile
     * takes up half of the available rowDouble.
     */
    card_small: {
        flex: 1,
        minHeight: 165,
        width: '100%',
        borderRadius: 15,
        padding: 10,
    },
});
