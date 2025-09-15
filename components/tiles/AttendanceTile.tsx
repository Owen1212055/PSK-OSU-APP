import React, {useEffect, useState} from 'react';
import {Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View,} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {ThemedText} from '@/components/ThemedText';
import {usePredefined} from '@/hooks/useThemeColor';
import APIService from '@/api/APIService';
import {ActiveEventCategory, getName, GradedEventEntity, GradedEventEntryWithBrother, Role,} from '@/api/Entities';
import {SafeAreaView} from "react-native-safe-area-context";

export default function GradedEventTile() {
    // ----- State ----- //
    const [categories, setCategories] = useState<ActiveEventCategory[]>([]);
    const [events, setEvents] = useState<GradedEventEntity[]>([]);

    // Edit/New modals
    const [modalVisible, setModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);

    // Event being edited
    const [selectedEvent, setSelectedEvent] = useState<GradedEventEntity | null>(null);
    // The entries belonging to that event
    const [selectedEntries, setSelectedEntries] = useState<GradedEventEntryWithBrother[]>([]);

    // New event state
    const [newEvent, setNewEvent] = useState<
        Partial<GradedEventEntity> & { maxPointOverride?: number }
    >({
        eventName: '',
        eventDesc: '',
        eventDate: new Date().toISOString(),
        eventType: 'CHAPTER',
    });

    // Theming
    const bubbleBackground = usePredefined('bubble_background');
    const borderColor = usePredefined('border_color');
    const buttonColor = usePredefined('special_button');
    const textColor = usePredefined('text');

    // DropDown state for event type dropdowns
    const [editTypeOpen, setEditTypeOpen] = useState(false);
    const [createTypeOpen, setCreateTypeOpen] = useState(false);
    // For each entry’s label dropdown, track whether it’s open.
    const [entryDropdownOpen, setEntryDropdownOpen] = useState<{ [entryId: number]: boolean }>({});

    // ----- Data fetching ----- //
    const fetchCategories = async () => {
        const data = await APIService.getCategories();
        setCategories(data);
    };

    const fetchEvents = async () => {
        try {
            const data = await APIService.getAllGradedEvents();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching graded events:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchEvents();
    }, []);

    // Helper: retrieve default maxPoints for a given category
    const getDefaultPoints = (categoryName: string): number => {
        const cat = categories.find((c) => c.name === categoryName);
        return cat ? cat.maxPoints : 0;
    };

    // ----- Opening/Closing modals ----- //
    const openModal = async (ev: GradedEventEntity) => {
        setSelectedEvent(ev);
        try {
            const entries = await APIService.getGradedEventEntries(ev.id);
            setSelectedEntries(entries);
        } catch (error) {
            console.error('Error loading entries:', error);
        }
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedEvent(null);
        setSelectedEntries([]);
    };

    const openCreateModal = () => {
        setNewEvent({
            eventName: '',
            eventDesc: '',
            eventDate: new Date().toISOString(),
            eventType: 'CHAPTER',
        });
        setCreateModalVisible(true);
    };

    const closeCreateModal = () => {
        setCreateModalVisible(false);
    };

    // ----- Handlers for editing fields ----- //
    const handleEventChange = (field: keyof GradedEventEntity, value: string) => {
        if (!selectedEvent) return;
        setSelectedEvent({ ...selectedEvent, [field]: value });
    };

    const handleMaxPointOverrideChange = (value: string) => {
        if (!selectedEvent) return;
        const parsed = parseInt(value, 10);
        setSelectedEvent({
            ...selectedEvent,
            maxPointOverride: isNaN(parsed) ? undefined : parsed,
        });
    };

    const handleNewEventChange = (field: keyof GradedEventEntity, value: string) => {
        setNewEvent((prev) => ({ ...prev, [field]: value }));
    };

    const handleNewMaxPointOverrideChange = (value: string) => {
        const parsed = parseInt(value, 10);
        setNewEvent((prev) => ({ ...prev, maxPointOverride: isNaN(parsed) ? undefined : parsed }));
    };

    // When the user types a numeric score manually.
    const handleEntryScoreChange = (entryId: number, newScore: string) => {
        const parsedScore = parseInt(newScore, 10);
        setSelectedEntries((prev) =>
            prev.map((e) => {
                if (e.entry.id === entryId) {
                    return {
                        ...e,
                        entry: { ...e.entry, scoreOverride: isNaN(parsedScore) ? 0 : parsedScore },
                    };
                }
                return e;
            })
        );
    };

    // When the user selects a label from the dropdown, update both the label and the numeric score.
    const handleEntryLabelChange = (entryId: number, newLabel: string) => {
        const cat = categories.find((c) => c.name === selectedEvent?.eventType);
        let defaultScore = 0;
        if (cat) {
            const found = cat.entries.find((opt) => opt.name === newLabel);
            if (found) {
                defaultScore = found.points;
            }
        }
        setSelectedEntries((prev) =>
            prev.map((e) => {
                if (e.entry.id === entryId) {
                    return {
                        ...e,
                        entry: { ...e.entry, scoreOverride: defaultScore, scoreName: newLabel },
                    };
                }
                return e;
            })
        );
    };

    // ----- CRUD operations ----- //
    const createEvent = async () => {
        try {
            const created = await APIService.createGradedEvent(newEvent);
            setEvents((prev) => [...prev, created]);
            closeCreateModal();
        } catch (error) {
            console.error('Error creating event:', error);
            Alert.alert('Error', 'Could not create event. Please try again.');
        }
    };

    // On save, we send the event and entries. The dropdown has priority:
    // If a valid label was selected, it sets the numeric score to that default.
    const saveUpdates = async () => {
        if (!selectedEvent) return;

        try {
            // 1) Update the event itself
            const updatedEvent = await APIService.updateGradedEvent(selectedEvent.id, selectedEvent);

            // 2) For each entry, send both the numeric score and the label.
            const updatePromises = selectedEntries.map((entryObj) => {
                const numericScore = entryObj.entry.scoreOverride;
                const label = entryObj.entry.scoreName;
                return APIService.updateGradedEventEntry(updatedEvent.id, entryObj.entry.id, {
                    scoreOverride: numericScore,
                    scoreName: label,
                });
            });
            await Promise.all(updatePromises);

            await fetchEvents();
            closeModal();
        } catch (error) {
            console.error('Error saving updates:', error);
            Alert.alert('Error', 'Failed to save event updates. Please try again.');
        }
    };

    const deleteUpdates = async () => {
        Alert.alert('Warning', 'Are you sure you want to delete this event?', [
            {
                text: 'Yes',
                onPress: async () => {
                    if (!selectedEvent) return;
                    try {
                        await APIService.deleteGradedEvent(selectedEvent.id);
                        await fetchEvents();
                        closeModal();
                    } catch (error) {
                        console.error('Error deleting event:', error);
                        Alert.alert('Error', 'Failed to delete event. Please try again.');
                    }
                },
            },
            { text: 'No' },
        ]);
    };

    const autoPopulate = async () => {
        if (!selectedEvent) return;
        try {
            const existing = await APIService.getGradedEventEntries(selectedEvent.id);
            const alreadySet = existing.map((en) => en.entry.brotherId);
            const allUsers = await APIService.getAllUsers();
            const missing = allUsers
                .filter((u) => !u.roles.includes(Role.PLEDGE))
                .map((bro) => bro.id)
                .filter((id) => !alreadySet.includes(id));
            await APIService.populateGradedEvent(selectedEvent.id, missing);
            const updatedEntries = await APIService.getGradedEventEntries(selectedEvent.id);
            setSelectedEntries(updatedEntries);
        } catch (error) {
            console.error('Error auto-populating event entries:', error);
            Alert.alert('Error', 'Failed to auto-populate missing entries. Please try again.');
        }
    };

    // For each entry’s dropdown, track its open state.
    const handleOpenEntryDropdown = (entryId: number, isOpen: boolean) => {
        setEntryDropdownOpen((prev) => ({ ...prev, [entryId]: isOpen }));
    };

    // ----- Render ----- //
    return (
        <View style={[styles.tileContainer, { backgroundColor: bubbleBackground }]}>
            <ThemedText type="subtitle" style={styles.tileTitle}>
                Graded Events
            </ThemedText>

            <TouchableOpacity style={[styles.createButton, { backgroundColor: buttonColor }]} onPress={openCreateModal}>
                <ThemedText type="default_button">Create New Event</ThemedText>
            </TouchableOpacity>

            {events.map((ev) => (
                <TouchableOpacity key={ev.id} onPress={() => openModal(ev)} style={styles.eventRow}>
                    <ThemedText>
                        {ev.eventName} ({ev.eventDate}) – Type: {ev.eventType}
                    </ThemedText>
                </TouchableOpacity>
            ))}

            {/* EDIT EVENT MODAL */}
            <Modal visible={modalVisible} animationType="slide" presentationStyle="formSheet" onRequestClose={closeModal}>
                <SafeAreaView style={[styles.modalContainer, { backgroundColor: bubbleBackground }]}>
                    {selectedEvent && (
                        <>
                            <ThemedText type="title" style={styles.modalTitle}>
                                {selectedEvent.eventName}
                            </ThemedText>

                            {/* Basic Fields */}
                            <TextInput
                                style={[styles.input, { color: textColor }]}
                                value={selectedEvent.eventDesc}
                                onChangeText={(text) => handleEventChange('eventDesc', text)}
                                placeholder="Event Description"
                            />
                            <TextInput
                                style={[styles.input, { color: textColor }]}
                                value={selectedEvent.eventName}
                                onChangeText={(text) => handleEventChange('eventName', text)}
                                placeholder="Event Name"
                            />

                            {/* Event Type Dropdown */}
                            <DropDownPicker
                                open={editTypeOpen}
                                setOpen={setEditTypeOpen}
                                value={selectedEvent.eventType}
                                setValue={(cb) => {
                                    const newVal = typeof cb === 'function' ? cb(selectedEvent.eventType) : cb;
                                    handleEventChange('eventType', newVal);
                                }}
                                items={categories.map((cat) => ({
                                    label: cat.name,
                                    value: cat.name,
                                }))}
                                placeholder="Select Event Type"
                                style={{ marginBottom: 10 }}
                                listMode="MODAL"
                            />

                            {/* maxPointOverride */}
                            <TextInput
                                style={[styles.input, { color: textColor }]}
                                keyboardType="numeric"
                                value={selectedEvent.maxPointOverride != undefined ? String(selectedEvent.maxPointOverride) : ''}
                                onChangeText={handleMaxPointOverrideChange}
                                placeholder={`Point Override (default: ${getDefaultPoints(selectedEvent.eventType)})`}
                            />

                            {/* Event Date */}
                            <TextInput
                                style={[styles.input, { color: textColor }]}
                                value={selectedEvent.eventDate}
                                onChangeText={(text) => handleEventChange('eventDate', text)}
                                placeholder="Event Date (YYYY-MM-DD)"
                            />

                            {/* Entries */}
                            <ThemedText type="subtitle" style={{ marginVertical: 10 }}>
                                Entries
                            </ThemedText>
                            <ScrollView style={styles.entryList}>
                                {selectedEntries.map((entryObj) => {
                                    const { entry } = entryObj;
                                    // Get allowed entries from the category
                                    const cat = categories.find((c) => c.name === selectedEvent.eventType);
                                    const allowedEntries = cat ? cat.entries : [];
                                    // The dropdown label is the user-selected label.
                                    // When changed, it updates the numeric score to the default.
                                    const currentLabel = entry.scoreName || '';

                                    return (
                                        <View key={entry.id} style={styles.entryRow}>
                                            {/* Brother Name */}
                                            <View style={styles.brotherNameContainer}>
                                                <ThemedText style={styles.brotherName} numberOfLines={1} ellipsizeMode="tail">
                                                    {getName.call(entryObj.brother)}
                                                </ThemedText>
                                            </View>
                                            {/* Numeric Score */}
                                            <View style={styles.scoreContainer}>
                                                <TextInput
                                                    style={[styles.entryInput, { borderColor, color: textColor }]}
                                                    keyboardType="numeric"
                                                    value={entry.scoreOverride != undefined ? String(entry.scoreOverride) : undefined}
                                                    placeholder={entry.scoreOverride == undefined ? String(cat?.entries.find((e) => e.name === entry.scoreName)?.points) : undefined}
                                                    onChangeText={(text) => handleEntryScoreChange(entry.id, text)}
                                                />
                                            </View>
                                            {/* Label Dropdown */}
                                            <View style={styles.dropdownContainer}>
                                                <DropDownPicker
                                                    open={!!entryDropdownOpen[entry.id]}
                                                    setOpen={(isOpen) => handleOpenEntryDropdown(entry.id, isOpen)}
                                                    value={currentLabel}
                                                    setValue={(cb) => {
                                                        const newVal = typeof cb === 'function' ? cb(currentLabel) : cb;
                                                        // When a new label is chosen from the dropdown, update numeric score to default value.
                                                        const chosenOption = allowedEntries.find((opt) => opt.name === newVal);
                                                        if (chosenOption) {
                                                            setSelectedEntries((prev) =>
                                                                prev.map((e) =>
                                                                    e.entry.id === entry.id
                                                                        ? {
                                                                            ...e,
                                                                            entry: {
                                                                                ...e.entry,
                                                                                scoreOverride: undefined,
                                                                                scoreName: chosenOption.name,
                                                                            },
                                                                        }
                                                                        : e
                                                                )
                                                            );
                                                        } else {
                                                            // For custom selections, just update the label.
                                                            handleEntryLabelChange(entry.id, newVal);
                                                        }
                                                    }}
                                                    items={[
                                                        ...allowedEntries.map((option) => ({
                                                            label: option.name,
                                                            value: option.name,
                                                        })),
                                                        { label: 'Custom', value: 'Custom' },
                                                    ]}
                                                    placeholder="Select Label"
                                                    listMode="MODAL"
                                                    style={{ width: 140 }}
                                                />
                                            </View>
                                        </View>
                                    );
                                })}
                            </ScrollView>

                            <TouchableOpacity style={[styles.createButton, { backgroundColor: buttonColor }]} onPress={autoPopulate}>
                                <ThemedText type="default_button">Auto Populate Missing Entries</ThemedText>
                            </TouchableOpacity>

                            {/* Actions */}
                            <View style={styles.actions}>
                                <TouchableOpacity style={[styles.createButton, { backgroundColor: buttonColor }]} onPress={closeModal}>
                                    <ThemedText type="default_button">Cancel</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.createButton, { backgroundColor: buttonColor }]} onPress={saveUpdates}>
                                    <ThemedText type="default_button">Save</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.createButton, { backgroundColor: buttonColor }]} onPress={deleteUpdates}>
                                    <ThemedText type="default_button">Delete</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </SafeAreaView>
            </Modal>

            {/* CREATE EVENT MODAL */}
            <Modal visible={createModalVisible} animationType="slide" presentationStyle="formSheet" onRequestClose={closeCreateModal}>
                <SafeAreaView style={[styles.modalContainer, { backgroundColor: bubbleBackground }]}>
                    <ThemedText type="title" style={styles.modalTitle}>
                        Create New Event
                    </ThemedText>
                    <TextInput
                        style={[styles.input, { color: textColor }]}
                        value={newEvent.eventName}
                        onChangeText={(text) => handleNewEventChange('eventName', text)}
                        placeholder="Event Name"
                    />
                    <TextInput
                        style={[styles.input, { color: textColor }]}
                        value={newEvent.eventDesc}
                        onChangeText={(text) => handleNewEventChange('eventDesc', text)}
                        placeholder="Event Description"
                    />
                    <DropDownPicker
                        open={createTypeOpen}
                        setOpen={setCreateTypeOpen}
                        value={newEvent.eventType}
                        setValue={(cb) => {
                            const newVal = typeof cb === 'function' ? cb(newEvent.eventType) : cb;
                            handleNewEventChange('eventType', newVal);
                        }}
                        items={categories.map((cat) => ({ label: cat.name, value: cat.name }))}
                        placeholder="Select Event Type"
                        listMode="MODAL"
                        style={{ marginBottom: 10 }}
                    />
                    <TextInput
                        style={[styles.input, { color: textColor }]}
                        keyboardType="numeric"
                        value={newEvent.maxPointOverride != undefined ? String(newEvent.maxPointOverride) : ''}
                        onChangeText={handleNewMaxPointOverrideChange}
                        placeholder={`Point Override (default: ${getDefaultPoints(newEvent.eventType || '')})`}
                    />
                    <TextInput
                        style={[styles.input, { color: textColor }]}
                        value={newEvent.eventDate}
                        onChangeText={(text) => handleNewEventChange('eventDate', text)}
                        placeholder="Event Date (YYYY-MM-DD)"
                    />
                    <View style={styles.actions}>
                        <TouchableOpacity style={[styles.createButton, { backgroundColor: buttonColor }]} onPress={closeCreateModal}>
                            <ThemedText type="default_button">Cancel</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.createButton, { backgroundColor: buttonColor }]} onPress={createEvent}>
                            <ThemedText type="default_button">Create</ThemedText>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
}

/* ----------------- STYLES ----------------- */
const styles = StyleSheet.create({
    tileContainer: {
        padding: 10,
        borderRadius: 8,
        marginVertical: 10,
    },
    tileTitle: {
        marginBottom: 10,
    },
    createButton: {
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    eventRow: {
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
    modalContainer: {
        flex: 1,
        padding: 16,
    },
    modalTitle: {
        marginBottom: 6,
        padding: 10,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
    },
    entryList: {
        marginVertical: 10,
    },
    entryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    brotherNameContainer: {
        flex: 2,
        marginRight: 8,
    },
    brotherName: {
        fontSize: 16,
    },
    scoreContainer: {
        flex: 1,
        marginRight: 8,
    },
    dropdownContainer: {
        flex: 2,
    },
    entryInput: {
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        textAlign: 'center',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 'auto',
    },
});
