import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import InactiveEvent from "@/components/newui/event/InactiveEvent";
import { Theme, useTheme } from "@/hooks/useThemeColor";
import { TitledView } from "@/components/newui/TitledView";
import { ActiveEvent, PlannedEvent } from "@/api/Entities";
import APIService from "@/api/APIService";
import { EventTile } from "@/components/newui/event/EventTile";
import { BADGE_ATTENDANCE_LOOKUP, RequiredEventTag } from "@/components/newui/event/EventTags";
import { ActiveEventTile } from "@/components/newui/event/ActiveEventTile";
import { useBanner } from "@/contexts/BannerProvider";

type Props = {
    activeFilter?: (p: ActiveEvent) => boolean;
    plannedFilter?: (p: PlannedEvent) => boolean;
};

export default function EventsPage({ activeFilter, plannedFilter }: Props) {
    const styles = useStyles(useTheme());
    const { showBanner, hideBanner } = useBanner();

    const [plannedEvents, setPlannedEvents] = useState<PlannedEvent[]>([]);
    const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([]);
    const [resolvedEvents, setResolvedEvents] = useState<
        { active: ActiveEvent; planned: PlannedEvent }[]
    >([]);

    useEffect(() => {
        const fetchData = async () => {
            const [actives, planned] = await Promise.all([
                APIService.getActiveEvents(),
                APIService.getAllPlannedEvents(),
            ]);

            setActiveEvents(activeFilter ? actives.filter(activeFilter) : actives);
            setPlannedEvents(plannedFilter ? planned.filter(plannedFilter) : planned);

            // fetch linked planned events for active ones
            const pairs = await Promise.all(
                (activeFilter ? actives.filter(activeFilter) : actives).map(async (a) => ({
                    active: a,
                    planned: await APIService.getPlannedEvent(a.linkedPlannedEvent),
                }))
            );

            setResolvedEvents(pairs);
        };

        fetchData();
        const id = setInterval(fetchData, 5000);
        return () => {
            clearInterval(id);
        };
    }, []);

    useEffect(() => {
        if (activeEvents.length > 0) {
            showBanner("Check in active!", "success");
        } else {
            hideBanner();
        }
    }, [activeEvents.length, showBanner, hideBanner]);

    return (
        <View style={styles.root}>
            {resolvedEvents.length == 0 ? <InactiveEvent/> : (
                <View>
                    {resolvedEvents.map((entry, idx) => {
                        const activeEvent = entry.active;
                        const plannedEvent = entry.planned;

                        const date = new Date(activeEvent.startTime);
                        const formatted = date.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                        });

                        return (<ActiveEventTile
                            key={idx}
                            identifier={activeEvent.id}
                            badge={undefined}
                            title={plannedEvent.eventName}
                            date={formatted}
                            location={activeEvent.location}
                            time={formatTimeRange(date, activeEvent.endTime ? new Date(activeEvent.endTime) : undefined)}
                            startTime={date}
                            activeEvent={activeEvent}
                        />);
                    })
                    }
                </View>
            )}
            <TitledView title={"Upcoming"}>
                <View style={styles.events}>
                    {plannedEvents.map((entry, idx) => {
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