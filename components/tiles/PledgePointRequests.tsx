import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ThemedText} from '@/components/ThemedText';
import {usePredefined} from '@/hooks/useThemeColor';
import APIService from '@/api/APIService';
import {AssociatePointEntry, UserInfo} from '@/api/Entities';
import {useFocusEffect} from "@react-navigation/native";

interface CachedPledgePointEntry {
    entry: AssociatePointEntry,
    brother: UserInfo,
    pledge: UserInfo,
}


export default function PledgePointRequests() {
    const [requests, setRequests] = useState<CachedPledgePointEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const bubbleBackground = usePredefined('bubble_background');
    const specialButton = usePredefined('special_button');
    const borderColor = usePredefined('border_color');



    const fetchRequests = async () => {
        try {
            const data = await APIService.getAllPledgePointRequests();
            const ans = await Promise.all(
                data.map(async (entry): Promise<CachedPledgePointEntry> => {
                    return {
                        entry: entry,
                        brother: await APIService.getUser(entry.brotherId),
                        pledge: await APIService.getUser(entry.pledgeId),
                    };
                })
            );

            setRequests(ans);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchRequests();
        }, [])
    );


    const handleAccept = async (req: CachedPledgePointEntry) => {
        await APIService.approvePledgePointRequest(req.entry.id).then((e) => {
            fetchRequests();
        });
    };

    const handleDeny = async (req: CachedPledgePointEntry) => {
        await APIService.denyPledgePointRequest(req.entry.id).then((e) => {
            fetchRequests();
        });
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: bubbleBackground }]}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: bubbleBackground }]}>
            <ThemedText type="subtitle" style={styles.title}>
                Pledge Point Requests
            </ThemedText>

            {requests.length === 0 ? (
                <ThemedText>No requests</ThemedText>
            ) : (
                requests.map((req) => (
                    <View key={req.entry.id} style={[styles.requestRow, { borderBottomColor: borderColor }]}>
                        <ThemedText style={styles.requestText}>
                            {`${req.brother.username} -> ${req.pledge.username}: ${req.entry.points} pts`}
                            {"\n"}
                            {req.entry.reason}
                        </ThemedText>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: specialButton }]}
                                onPress={() => handleAccept(req)}
                            >
                                <ThemedText style={styles.buttonText}>ACCEPT</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.denyButton]} onPress={() => handleDeny(req)}>
                                <ThemedText style={styles.buttonText}>DENY</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 10,
        gap: 8,
    },
    title: {
        marginBottom: 10,
    },
    requestRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        justifyContent: 'space-between',
        borderBottomWidth: 0.4,
    },
    requestText: {
        flex: 1,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 6,
    },
    button: {
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    denyButton: {
        backgroundColor: 'red',
    },
});