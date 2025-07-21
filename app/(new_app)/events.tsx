import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import InactiveEvent from "@/components/newui/event/InactiveEvent";
import {Theme, useTheme} from "@/hooks/useThemeColor";
import {TitledView} from "@/components/newui/TitledView";
import {ActiveEvent, PlannedEvent} from "@/api/Entities";
import APIService from "@/api/APIService";
import {EventTile} from "@/components/newui/event/EventTile";
import {BADGE_ATTENDANCE_LOOKUP, RequiredEventTag} from "@/components/newui/event/EventTags";
import {CurrentEvent} from "@/components/tiles/CurrentEvent";
import {ActiveEventTile} from "@/components/newui/event/ActiveEventTile";

export default function Events() {
    const styles = useStyles(useTheme());

    const [scores, setScores] = useState<PlannedEvent[]>([]);
    const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([]);
    useEffect(() => {
        APIService.getAllPlannedEvents().then((me) => {
            setScores(me);
        });

        APIService.getActiveEvents().then((me) => {
            setActiveEvents(me);
        });

        // TODO: remove
        setInterval(() => {
            APIService.getAllPlannedEvents().then((me) => {
                setScores(me);
            });

            APIService.getActiveEvents().then((me) => {
                setActiveEvents(me);
            });
        }, 5000); // every 5 seconds refresh it
    }, []);


    return (
        <View style={styles.root}>
            {activeEvents.length == 0 ? <InactiveEvent/> : (
                <View>
                    {activeEvents.map((entry, idx) => {
                        const date = new Date(entry.startTime);
                        const formatted = date.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                        });

                        return (<ActiveEventTile
                            key={idx}
                            badge={undefined}
                            title={entry.eventName}
                            date={formatted}
                            location={entry.location}
                            time={formatTimeRange(date, entry.endTime ? new Date(entry.endTime) : undefined)}
                            startTime={date}
                        />);
                    })
                    }
                </View>
            )}
            <TitledView title={"Upcoming"}>
                <View style={styles.events}>
                    {scores.map((entry, idx) => {
                        let badge;
                        if (entry.requiredAttendance) {
                            badge = <RequiredEventTag/>;
                        } else {
                            badge = BADGE_ATTENDANCE_LOOKUP[entry.policy];
                        }
                        const date = new Date(entry.startTime);
                        const formatted = date.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                        });

                        return (<EventTile key={idx} badge={badge} title={entry.eventName} date={formatted} location={entry.locationname} time={formatTimeRange(date, entry.endTime ? new Date(entry.endTime) : undefined)}/>);
                    })
                    }
                </View>
            </TitledView>
        </View>
    );
}

function formatTime(date: Date): string {
    const raw = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).toLowerCase();

    return raw.replace(':00', '');
}

function formatTimeRange(start: Date, end?: Date): string {
    const startStr = formatTime(start);
    if (!end) return startStr;
    const endStr = formatTime(end);
    return `${startStr} - ${endStr}`;
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        root: {
            flex: 1,
            gap: 24
        },
        events: {
            gap: 12
        }
    });
}
