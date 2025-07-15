import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {ThemedText} from '@/components/ThemedText';
import {usePredefined} from '@/hooks/useThemeColor';
import APIService from '@/api/APIService';
import {Invite} from "@/api/Entities"; // make sure the APIService file exports the instance

export default function InviteElement() {
    const [invites, setInvites] = useState<Invite[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [inputDays, setInputDays] = useState('');
    const [inputMaxUses, setInputMaxUses] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [loading, setLoading] = useState(false);

    const specialButton = usePredefined('special_button');
    const backgroundColor = usePredefined('bubble_background');

    // Fetch invites from the API when component mounts
    useEffect(() => {
        const fetchInvites = async () => {
            try {
                setLoading(true);
                const data = await APIService.getAllInvites();
                setInvites(data);
            } catch (error) {
                console.error('Error fetching invites', error);
                Alert.alert('Error', 'Could not fetch invites.');
            } finally {
                setLoading(false);
            }
        };
        fetchInvites();
    }, []);

    const generateRandomCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const handleCreateInvite = async () => {
        const days = parseInt(inputDays, 10);
        const maxUses = parseInt(inputMaxUses, 10);

        if (isNaN(days) || days < 0) {
            Alert.alert('Invalid Input', 'Please enter a valid number of days.');
            return;
        }
        if (isNaN(maxUses) || maxUses <= 0) {
            Alert.alert('Invalid Input', 'Please enter a valid number for people allowed.');
            return;
        }

        let expiresAt = '';
        if (days > 0) {
            const expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + days);
            expiresAt = expireDate.toISOString();
        }

        const code = inputCode.trim() !== '' ? inputCode.trim().toUpperCase() : generateRandomCode();

        try {
            setLoading(true);
            const newInvite = await APIService.createInvite({ code, maxUses, expiresAt });
            setInvites((prev) => [newInvite, ...prev]);
            // Reset form inputs and hide form
            setInputDays('');
            setInputMaxUses('');
            setInputCode('');
            setShowForm(false);
        } catch (error) {
            console.error('Error creating invite', error);
            Alert.alert('Error', 'Could not create invite.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteInvite = async (invite: Invite) => {
        try {
            setLoading(true);
            await APIService.deleteInvite(invite.id);
            setInvites((prev) => prev.filter((inv) => inv.id !== invite.id));
        } catch (error) {
            console.error('Error deleting invite', error);
            Alert.alert('Error', 'Could not delete invite.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <ThemedText type="subtitle" style={styles.title}>
                Invites
            </ThemedText>

            <TouchableOpacity
                style={[styles.createButton, { backgroundColor: specialButton }]}
                onPress={() => setShowForm(true)}
            >
                <ThemedText style={styles.createButtonText}>Create Invite</ThemedText>
            </TouchableOpacity>

            {showForm && (
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Days to expire"
                        keyboardType="numeric"
                        value={inputDays}
                        onChangeText={setInputDays}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Number of people allowed"
                        keyboardType="numeric"
                        value={inputMaxUses}
                        onChangeText={setInputMaxUses}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Custom Invite Code (optional)"
                        value={inputCode}
                        onChangeText={setInputCode}
                    />
                    <View style={styles.formButtons}>
                        <TouchableOpacity
                            style={[styles.submitButton, { backgroundColor: specialButton }]}
                            onPress={handleCreateInvite}
                        >
                            <ThemedText style={styles.buttonText}>Submit Invite</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setShowForm(false)}
                        >
                            <ThemedText style={styles.buttonText}>Cancel</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {loading && <ActivityIndicator size="small" color="#000" />}

            {invites.map((invite) => (
                <View key={invite.id} style={styles.inviteBox}>
                    <ThemedText>Code: {invite.code}</ThemedText>
                    <ThemedText>Max Uses: {invite.maxUses}</ThemedText>
                    <ThemedText>
                        Used By: {invite.usedBy.length} / {invite.maxUses}
                    </ThemedText>
                    {invite.expiresAt && (
                        <ThemedText>
                            Expires At: {new Date(invite.expiresAt).toLocaleString()}
                        </ThemedText>
                    )}
                    {invite.usedBy.map((u, i) => (
                        <ThemedText key={i}>
                            - {u.username} used
                        </ThemedText>
                    ))}
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteInvite(invite)}
                    >
                        <ThemedText style={{ color: '#fff' }}>Delete Invite</ThemedText>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    title: {
        marginBottom: 10,
    },
    createButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginBottom: 10,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    formContainer: {
        marginBottom: 15,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        marginBottom: 10,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    submitButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    cancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 6,
        backgroundColor: 'gray',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    inviteBox: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        marginVertical: 5,
    },
    deleteButton: {
        backgroundColor: 'red',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 6,
        alignSelf: 'flex-start',
    },
});
