// AdminPanel.tsx
import React from 'react';
import {StyleSheet, View} from 'react-native';

import MemberManagement from '@/components/tiles/MemberManagement';
import Invite from '@/components/tiles/Invite';
import AttendanceTile from '@/components/tiles/AttendanceTile';
import PledgePointRequests from '@/components/tiles/PledgePointRequests';

import {usePredefined} from '@/hooks/useThemeColor';

export default function AdminPanel() {
    const bubbleBackground = usePredefined('bubble_background');

    return (
        <View>
            <View style={styles.rowSingle}>
                <View style={[styles.card_big, {backgroundColor: bubbleBackground}]}>
                    <PledgePointRequests/>
                </View>
            </View>
            <View style={styles.rowSingle}>
                <View style={[styles.card_big, {backgroundColor: bubbleBackground}]}>
                    <MemberManagement/>
                </View>
            </View>
            <View style={styles.rowSingle}>
                <View style={[styles.card_big, {backgroundColor: bubbleBackground}]}>
                    <AttendanceTile/>
                </View>
            </View>
            <View style={styles.rowSingle}>
                <View style={[styles.card_big, {backgroundColor: bubbleBackground}]}>
                    <Invite/>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    rowSingle: {
        marginBottom: 10,
        width: '100%',
        flexDirection: 'row'
    },
    card_big: {
        flex: 1,
        minHeight: 165,
        width: '100%',
        borderRadius: 15,
        padding: 10,
    },
});