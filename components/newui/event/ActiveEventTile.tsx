import {Alert, Linking, Platform, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {Theme, useTheme} from "@/hooks/useThemeColor";
import React, {useEffect, useState} from "react";
import {ThemedText} from "@/components/ThemedText";
import {RedirectButton} from "@/components/newui/input/RedirectButton";
import {BubbleCard} from "@/components/newui/frame/BubbleCard";
import {FancyCheckInButton} from "@/components/newui/input/FancyCheckInButton";
import * as Location from "expo-location";
import {LocationAccuracy} from "expo-location";
import APIService from "@/api/APIService";
import {ActiveEvent} from "@/api/Entities";
import {BubbleFrame} from "@/components/newui/frame/OutlinedBubbleFrame";
import {Check} from "lucide-react-native";

interface EventTileProps {
    badge: React.ReactNode;
    date: string;
    time: string;
    title: string;
    identifier: number;
    location: string;
    startTime: Date;
    activeEvent: ActiveEvent;
}

export type State = 'unset' | 'present' | 'late' | 'error' | 'too_far';

export const ActiveEventTile: React.FC<EventTileProps> = ({
                                                              badge,
                                                              date,
                                                              time,
                                                              title,
                                                              location,
                                                              identifier,
                                                              startTime,
                                                              activeEvent,
                                                          }) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    const [state, setState] = useState<State>('unset');

    useEffect(() => {
        APIService.me().then((me) => {
            // @ts-ignore
            const checkInState = activeEvent.checkedIn[me.id];
            let state : State = 'unset';
            if (checkInState == "LATE") {
                state = 'late';
            } else if (checkInState == "ON_TIME") {
                state = 'present';
            }

            setState(state);
        })
    }, []);

    const handleCheckIn = async () => {

        try {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setState('error');
                return;
            }

            let location = await Location.getCurrentPositionAsync({accuracy: LocationAccuracy.Balanced});
            let res = await APIService.checkInActiveEvent(identifier, location.coords.latitude, location.coords.longitude);

            if (res.response == 'CHECKED_IN') {
                setState('present');
            } else if (res.response == 'CHECKED_IN_LATE') {
                setState('late');
            } else if (res.response == 'TOO_FAR') {
                setState('error');
                Alert.alert('Check in fail!', "You're too far away from the target location!");
                setTimeout(() => setState('unset'), 2000);
            }
        } catch (error) {
            Alert.alert('Check in fail!', `${error}`);
            console.error('Check-in error:', error);
            setState('error');
            setTimeout(() => setState('unset'), 2000);
        }
    };

    const openMap = ({}) => {
        const lat = activeEvent.latitude;
        const lng = activeEvent.longitude;

        const scheme = Platform.select({
            ios: `maps://?q=${title}&ll=${lat},${lng}`,
            android: `geo:${lat},${lng}?q=${lat},${lng}(${title})`,
        });
        if (scheme) {
            Linking.openURL(scheme).catch((err) =>
                console.error('Error opening map: ', err)
            );
        }
    };

    return (
        <BubbleCard>
            <View style={styles.container}>
                <View style={styles.text_header}>
                    <View style={styles.text_description}>
                        <ThemedText type="subtitle">{title}</ThemedText>
                        <TouchableOpacity onPress={openMap}>
                            <ThemedText>{location}</ThemedText>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.header_mirror}>
                        <ThemedText type="subtitle">{date}</ThemedText>
                        <ThemedText>{time}</ThemedText>
                    </View>
                </View>
                {/*<ThemedText>Starts in {countdownLabel}</ThemedText>*/}

                <View style={styles.buttons}>
                    {
                        state === 'unset' ? (
                            <FancyCheckInButton title={"I'm here!"} onPress={handleCheckIn} />
                        ) : state === 'present' ? (
                            <View style={styles.button_message_holder}>
                                <ThemedText type="title_new" colorType={'checkIn'}>Present</ThemedText>
                                <Check strokeWidth={3.75} color={theme.checkIn} />
                            </View>
                        ) : state === 'late' ? (
                            <View style={styles.button_message_holder}>
                                <ThemedText type="title_new" colorType={'text'}>Late</ThemedText>
                                <Check strokeWidth={3.75} color={theme.text} />
                            </View>
                        ) : state === 'error' ? (
                            <View style={styles.button_message_holder}>
                                <ThemedText type="title_new" colorType={'urgent'}>Error</ThemedText>
                            </View>
                        ) : null
                    }
                    {/*<RedirectButton title="Show Event Details"/>*/}
                </View>
            </View>
        </BubbleCard>
    );
};

function useStyles(theme: Theme) {
    return StyleSheet.create({
        container: {
            gap: 48
        },
        button_message_holder: {
            gap: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        text_header: {
            alignSelf: "stretch",
            flexDirection: "row",
            justifyContent: 'space-between',
            gap: 16
        },
        buttons: {
            gap: 16
        },
        badge_content: {
            justifyContent: "center",
        },
        icons: {
            alignSelf: "stretch",
            flexDirection: "row",
            justifyContent: 'space-between',
            gap: 16,
        },
        text_description: {
            gap: 4,
            flexShrink: 1
        },
        header_mirror: {
            alignItems: 'flex-end',
            gap: 4
        }
    });
}
