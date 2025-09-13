import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, Text, View, Keyboard, Pressable, Alert } from "react-native";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetScrollView, BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { GradedEventScoreboardEntry } from "@/api/Entities";
import { NavBar } from "@/components/newui/input/NavBar";
import { TitledView } from "@/components/newui/TitledView";
import { BubbleFrame } from "@/components/newui/frame/OutlinedBubbleFrame";
import { LeaderboardEntry } from "@/components/newui/LeaderboardEntry";
import { PrimaryButton } from "@/components/newui/input/PrimaryButton";
import { RoundedBottomSheetInputBox } from "@/components/newui/input/RoundedBottomSheetInputBox";
import APIService from "@/api/APIService";
import {SimpleButton} from "@/components/newui/input/SimpleButton";
import {ThemeProviderCtx} from "@/contexts/ThemeProvider";
import {color, inverseColor, Theme, useTheme} from "@/hooks/useThemeColor";

export type LeaderboardDetailsSheetHandle = {
    open: (entry: GradedEventScoreboardEntry) => void;
    close: () => void;
};

type Props = { onClosed?: () => void };

const AssociatePointSubmitSheet = forwardRef<LeaderboardDetailsSheetHandle, Props>(
    ({ onClosed }, ref) => {
        const [reason, setReason] = useState("");
        const [pointsStr, setPointsStr] = useState("5");
        const [selected, setSelected] = useState<GradedEventScoreboardEntry | null>(null);
        const sheetRef = useRef<BottomSheetModal>(null);

        useImperativeHandle(ref, () => ({
            open: (entry) => {
                setSelected(entry);

                setReason("");
                setPointsStr("5");
                sheetRef.current?.present();
            },
            close: () => sheetRef.current?.dismiss(),
        }));


        const changeBy = (delta: number) => {
            const current = parseInt(pointsStr, 10);
            const base = Number.isFinite(current) ? current : 0;
            setPointsStr(String(base + delta));
        };

        const onSubmit = async () => {
            const trimmed = reason.trim();
            const pointsNum = Number(pointsStr);

            if (!trimmed) {
                Alert.alert("Reason required", "Please enter a reason before submitting.");
                return;
            }
            if (!Number.isFinite(pointsNum)) {
                Alert.alert("Invalid points", "Points must be a valid number.");
                return;
            }

            try {
                Keyboard.dismiss();
                await APIService.createPledgePointRequest({
                    reason: trimmed,
                    points: pointsNum,
                    pledgeId: selected!!.user.id,
                });
                Alert.alert("Submitted", "Your pledge point request was created.");
                sheetRef.current?.dismiss();
            } catch (e: any) {
                Alert.alert("Submit failed", e?.message || "Please try again.");
            }
        };

        const styles = useStyles(useTheme());

        return (
            <BottomSheetModal
                ref={sheetRef}
                enablePanDownToClose
                onDismiss={onClosed}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                        pressBehavior="close"
                    />
                )}
                backgroundStyle={styles.root}
                keyboardBehavior="interactive"
                keyboardBlurBehavior="restore"
                android_keyboardInputMode="adjustResize"
                handleIndicatorStyle={{ backgroundColor: "#9ca3af" }}
            >

                <Pressable style={styles.root} onPress={Keyboard.dismiss} android_disableSound>
                    <ThemeProviderCtx>
                    <BottomSheetView style={styles.content}>
                        <View style={styles.section}>
                            <View style={styles.fieldSection}>
                                <NavBar title="Submit Point Change" popup onClose={() => sheetRef.current?.dismiss()} />

                                <View style={styles.fields}>
                                    <TitledView title="Associate" titleTheme="title_new_chunky_subtext_heavy">
                                        <BubbleFrame>
                                            <View style={styles.leaderboard_view}>
                                                {selected && <LeaderboardEntry standing={1} points={50} brotherInfo={selected.user} />}
                                            </View>
                                        </BubbleFrame>
                                    </TitledView>

                                    <TitledView title="Points" titleTheme="title_new_chunky_subtext_heavy">
                                        <View style={styles.pointSelectors}>
                                            <SimpleButton title="-5" onPress={() => changeBy(-5)} />
                                            <RoundedBottomSheetInputBox
                                                value={pointsStr}
                                                onChangeText={setPointsStr}
                                                style={{ minWidth: 82, textAlign: "center", color: color(useTheme(), 'text') }}
                                                keyboardType="numeric"
                                            />
                                            <SimpleButton title="+5" onPress={() => changeBy(5)} />
                                        </View>
                                    </TitledView>

                                    <TitledView title="Reason" titleTheme="title_new_chunky_subtext_heavy">
                                        <RoundedBottomSheetInputBox
                                            placeholder="Please type a reason"
                                            value={reason}
                                            onChangeText={setReason}
                                            autoCorrect={true}
                                        />
                                    </TitledView>
                                </View>
                            </View>

                            <PrimaryButton title="Submit" onPress={onSubmit} />
                        </View>
                    </BottomSheetView>
                    </ThemeProviderCtx>
                </Pressable>
            </BottomSheetModal>
        );
    }
);

export default AssociatePointSubmitSheet;

function useStyles(theme: Theme) {
    return StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: color(theme, 'bubble_background')
        },
        content: {
            padding: 16,
            paddingTop: 0
        },
        section: {
            gap: 32
        },
        fieldSection: {
            gap: 16
        },
        fields: {
            gap: 20
        },
        leaderboard_view: {
            alignSelf: "stretch"
        },
        pointSelectors: {
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
        }
    });
}