// src/components/EventTags.tsx
import React from 'react';
import {color, useTheme} from '@/hooks/useThemeColor';
import {CircleAlertIcon,} from 'lucide-react-native';
import {EventTag} from "@/components/newui/event/EventTag";
import {AttendanceState} from "@/api/Entities";

/**
 * Preconfigured event tags—no props needed, just import and use.
 * Text and icon colors derive from the current theme.
 */

export const RequiredEventTag: React.FC = () => {
    const theme = useTheme();
    const textColor = color(theme, 'urgent');
    return (
        <EventTag
            label="Required Event"
            icon={<CircleAlertIcon strokeWidth={3} width={16} height={16} color={textColor} />}
            backgroundColor="rgba(246, 53, 0, 0.1)"
            textColor={textColor}
        />
    );
};

export const OpenToCampusTag: React.FC = () => {
    const theme = useTheme();
    const textColor = color(theme, 'open_to_campus');
    return (
        <EventTag
            label="🌐Open to campus"
            backgroundColor="rgba(81, 203, 255, 0.10)"
            textColor={textColor}
        />
    );
};

export const ActivesOnly: React.FC = () => {
    const theme = useTheme();
    const textColor = color(theme, 'text');
    return (
        <EventTag
            label="🔒 Actives only"
            backgroundColor="rgba(0, 0, 0, 0.06)"
            textColor={textColor}
        />
    );
};

export const ActivesAndFriends: React.FC = () => {
    const theme = useTheme();
    const textColor = color(theme, 'text');
    return (
        <EventTag
            label="👯 Actives and friends"
            backgroundColor="rgba(178, 165, 0, 0.10)"
            textColor={textColor}
        />
    );
};

export const InviteOnly: React.FC = () => {
    const theme = useTheme();
    const textColor = color(theme, 'invite_only');
    return (
        <EventTag
            label="📥 Invite only"
            backgroundColor="rgba(76, 159, 240, 0.10)"
            textColor={textColor}
        />
    );
};


export const BADGE_ATTENDANCE_LOOKUP: Record<AttendanceState, React.ReactNode> = {
    ACTIVES_ONLY: <ActivesOnly />,
    ACTIVES_AND_ALUMNI: <ActivesAndFriends />,
    OPEN_TO_CAMPUS: <OpenToCampusTag />,
    INVITE_ONLY: <InviteOnly />,
};