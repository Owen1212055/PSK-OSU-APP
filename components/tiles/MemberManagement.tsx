import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {ThemedText} from '@/components/ThemedText';
import {usePredefined} from '@/hooks/useThemeColor';

// Import the Picker from the community package:
import {Picker} from '@react-native-picker/picker';
import {useFocusEffect} from "@react-navigation/native";
import APIService from "@/api/APIService";
import {Role, UserInfo} from "@/api/Entities";
import ProfilePicture from "@/components/newui/util/ProfilePicture";

export default function MemberManagement() {
    const [brothers, setBrothers] = useState<UserInfo[]>([]);

    const fetchUser = async () => {
        const user = await APIService.getAllUsers();
        setBrothers(user);
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchUser();
        }, [])
    );



    // Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBrother, setSelectedBrother] = useState<UserInfo>();

    // Info popup states
    const [infoPopupVisible, setInfoPopupVisible] = useState(false);
    const [infoText, setInfoText] = useState('');

    // Temporarily store the role picked in the picker
    const [tempRole, setTempRole] = useState<Role>(Role.BROTHER);

    const specialButton = usePredefined('special_button');
    const backgroundColor = usePredefined('bubble_background');
    const borderColor = usePredefined('border_color');

    // We'll simulate roles in an array
    const roles = [Role.PLEDGE, Role.BROTHER, Role.EXEC];

    // Open the role picker modal
    const openRoleModal = (brother: any) => {
        setSelectedBrother(brother);
        setTempRole(brother.role); // preload the current role in the picker
        setModalVisible(true);
    };

    // Remove user
    const handleRemove = async (brother: UserInfo) => {
        Alert.alert(
            "Warning",
            "Are you sure you want to remove " + brother.username,
            [
                {
                    text: "Yes",
                    onPress: () => {
                        APIService.removeUser(brother.id);
                        setBrothers((prev) => prev.filter((b) => b.id !== brother.id));
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    };

    // Info popup
    const handleInfo = (brother: any) => {
        setInfoText(`Some info about ${brother.name}, role: ${brother.role}`);
        setInfoPopupVisible(true);
    };

    // Apply the newly picked role
    const applyRole = () => {
        if (!selectedBrother || !modalVisible) return;
        APIService.modifyRole(selectedBrother.id, {roles: [tempRole]}).then(r => {
            fetchUser();
            closeRoleModal();
        });
    };

    const closeRoleModal = () => {
        setModalVisible(false);
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <ThemedText type="subtitle" style={styles.title}>
                Member Management
            </ThemedText>

            {brothers.map((bro, idx) => (
                <View key={idx} style={[styles.broRow, {borderBottomColor: borderColor}]}>
                    <ProfilePicture user={bro}/>
                    <ThemedText>{bro.username}</ThemedText>
                    <ThemedText>({bro.roles})</ThemedText>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.roleButton, { backgroundColor: specialButton }]}
                            onPress={() => openRoleModal(bro)}
                        >
                            <ThemedText style={styles.actionText}>Role</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => handleRemove(bro)}
                        >
                            <ThemedText style={styles.actionText}>Remove</ThemedText>
                        </TouchableOpacity>

                    </View>
                </View>
            ))}

            {/* Role Picker Modal */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalBackdrop}>
                    <View style={[styles.modalContent, { borderColor }, {backgroundColor: backgroundColor}]}>
                        <ThemedText type="subtitle" style={styles.modalTitle}>
                            Select Role
                        </ThemedText>

                        {/* Vertical Picker */}
                        <View style={[styles.pickerContainer, {borderColor: borderColor}]}>
                            <Picker
                                selectedValue={tempRole}
                                onValueChange={(itemValue) => setTempRole(itemValue)}
                                mode="dropdown" // or "dialog"
                            >
                                {roles.map((r) => (
                                    <Picker.Item label={r} value={r} key={r} />
                                ))}
                            </Picker>
                        </View>

                        {/* Actions */}
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.roleButton, { backgroundColor: '#ccc' }]}
                                onPress={closeRoleModal}
                            >
                                <ThemedText style={styles.actionText}>Cancel</ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.roleButton, { backgroundColor: specialButton }]}
                                onPress={applyRole}
                            >
                                <ThemedText style={styles.actionText}>Done</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Info Popup */}
            <Modal visible={infoPopupVisible} transparent animationType="fade">
                <View style={styles.modalBackdrop}>
                    <View style={[styles.infoPopup, {backgroundColor: backgroundColor}]}>
                        <ThemedText>{infoText}</ThemedText>
                        <TouchableOpacity
                            style={[styles.roleButton, { backgroundColor: '#ccc', marginTop: 10 }]}
                            onPress={() => setInfoPopupVisible(false)}
                        >
                            <ThemedText style={styles.actionText}>Close</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    },
    title: {
        marginBottom: 10,
    },
    broRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 5,
        borderBottomWidth: 0.4,
    },
    actionButtons: {
        marginLeft: 'auto',
        flexDirection: 'row',
        gap: 4,
    },
    roleButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    removeButton: {
        backgroundColor: 'red',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    infoButton: {
        backgroundColor: '#888',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    actionText: {
        color: '#fff',
    },

    // Backdrop for modals
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    modalContent: {
        borderWidth: 0.5,
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        marginBottom: 20,
        textAlign: 'center',
    },
    pickerContainer: {
        marginBottom: 16,
        borderWidth: 0.5,
        borderRadius: 6,
        overflow: 'hidden',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoPopup: {
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
});
