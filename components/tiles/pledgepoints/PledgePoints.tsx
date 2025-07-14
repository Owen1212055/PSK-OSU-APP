import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform, Modal,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SlidersHorizontal } from 'lucide-react-native';
import { usePredefined } from '@/hooks/useThemeColor';
import APIService from '@/api/APIService';
import {PledgePointStanding, UserInfo} from "@/api/Entities";
import {useFocusEffect} from "@react-navigation/native";
import {PledgePointEntry} from "@/components/tiles/pledgepoints/PledgePointEntry";

interface PledgeItem {
  pledge: UserInfo;
  score: number;
}

export function PledgePoints() {
  const [data, setData] = useState<PledgeItem[]>([]);
  // Modal states
  const [selectedItem, setSelectedItem] = useState<PledgeItem | null>(null);

  // Editable fields in the modal
  const [tempPoints, setTempPoints] = useState(0);
  const [reason, setReason] = useState('');
  const [showReasonPicker, setShowReasonPicker] = useState(false);

  const textColor = usePredefined('text');
  const specialButtonColor = usePredefined('special_button');
  const borderColor = usePredefined('border_color');
  const bubbleBackground = usePredefined('bubble_background');

  // Predefined reasons (label + default points)
  const predefinedReasons = [
    { label: 'swipes', points: 5 }
  ];

  const fetchData = async () => {
    try {
      // Assume this returns an array of entries with: id, brotherId, pledgeId, points, status
      const response = await APIService.getAllPledgePoints();
      const items : PledgeItem[] = response.map((entry: PledgePointStanding) => {
        let count = 0;
        entry.pledgePoints.forEach((entry) => {
          count += entry.points;
        })

        return {
          pledge: entry.user,
          score: count,
        };
      });

      setData(items);
    } catch (error) {
      console.error('Error fetching pledge points:', error);
    }
  };

  // Fetch entries from the API on component mount
  useFocusEffect(
      React.useCallback(() => {
        fetchData();
      }, [])
  );

  // Open the modal and preload the item
  const handleOpenModal = (item: PledgeItem) => {
    setSelectedItem(item);
    setTempPoints(0);
    setReason('');
  };

  // Close the modal
  const handleCloseModal = () => {
    setSelectedItem(null);
    setReason('');
    setShowReasonPicker(false);
  };

  // Submit changes using the update endpoint
  const handleSubmit = async () => {
    if (!selectedItem) return;
    // Call the API to update the entry.
    // It is assumed that updatePledgePointEntry takes the id and a payload (here points and reason)
    await APIService.createPledgePointRequest( {
      points: tempPoints,
      reason: reason,
      pledgeId: selectedItem.pledge.id
    }).then(() => {
      fetchData();
      handleCloseModal();
    })

  };

  // +/- logic
  const handleIncrement = () => setTempPoints((prev) => prev + 1);
  const handleDecrement = () => setTempPoints((prev) => prev - 1);

  // Direct numeric editing
  const handlePointsChange = (text: string) => {
    const parsed = parseInt(text, 10);
    setTempPoints(isNaN(parsed) ? 0 : parsed);
  };

  // Select a predefined reason
  const pickReason = (reasonItem: { label: string; points: number }) => {
    setReason(reasonItem.label);
    setTempPoints(reasonItem.points);
    setShowReasonPicker(false);
  };

  return (
      <View style={styles.container}>
        <ThemedText type="subtitle">
          Pledge Points
        </ThemedText>

        {/* List of pledge items */}
        <View>
          {data.sort((a, b) => b.score - a.score).map((item) => (
              <View key={item.pledge.id}>
                <PledgePointEntry  pledge={item.pledge} score={item.score} callback={() => handleOpenModal(item)} ></PledgePointEntry>
              </View>
          ))}
        </View>

        {/* Modal for editing points */}
        <Modal visible={selectedItem !== null} transparent animationType="slide" touc>
          <View style={styles.modalBackdrop} >
            <View style={[styles.modalContainer, { backgroundColor: bubbleBackground }]}>
              <ThemedText style={styles.modalTitle}>Add Points</ThemedText>

              {/* +/- plus direct input */}
              <ThemedText style={styles.label}>Points:</ThemedText>
              <View style={styles.pointsAdjuster}>
                <TouchableOpacity style={styles.adjustButton} onPress={handleDecrement}>
                  <Text style={styles.adjustButtonText}>-</Text>
                </TouchableOpacity>
                <TextInput
                    style={[styles.pointsInput, {color: textColor}]}
                    keyboardType="numeric"
                    value={tempPoints.toString()}
                    onChangeText={handlePointsChange}
                />
                <TouchableOpacity style={styles.adjustButton} onPress={handleIncrement}>
                  <Text style={styles.adjustButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Reason input + "picker" button */}
              <ThemedText style={styles.label}>Reason:</ThemedText>
              <View style={styles.reasonRow}>
                <TextInput
                    style={[styles.input, { flex: 1, color: textColor}]}
                    value={reason}
                    onChangeText={setReason}
                    placeholder="Enter reason..."
                    placeholderTextColor="#888"
                />
                <TouchableOpacity
                    style={styles.reasonPickerButton}
                    onPress={() => setShowReasonPicker((prev) => !prev)}
                >
                  <Text style={styles.reasonPickerButtonText}>⋯</Text>
                </TouchableOpacity>
              </View>

              {/* Dropdown-like list of predefined reasons */}
              {showReasonPicker && (
                  <View style={styles.predefinedContainer}>
                    {predefinedReasons.map((r) => (
                        <TouchableOpacity
                            key={r.label}
                            style={styles.reasonOption}
                            onPress={() => pickReason(r)}
                        >
                          <Text>
                            {r.label} — {r.points} pts
                          </Text>
                        </TouchableOpacity>
                    ))}
                  </View>
              )}

              {/* Cancel & Submit (Cancel first) */}
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: specialButtonColor }]}
                    onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  modalContainer: {
    borderRadius: 12,
    padding: 20,
    paddingBottom: 50,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  pointsAdjuster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  pointsInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 8,
    minWidth: 50,
  },
  adjustButton: {
    backgroundColor: '#eee',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
  },
  reasonPickerButton: {
    marginLeft: 8,
    backgroundColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reasonPickerButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  predefinedContainer: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    marginBottom: 12,
  },
  reasonOption: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
