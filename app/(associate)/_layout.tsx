import React from 'react';

import TabbedPagerLayout from "@/app/layout/TabbedPagerLayout";
import AssociatePointLeaderboard from "@/app/(associate)/associatepoints";
import EventPage from "@/app/common/events";
import AssociateEventsPage from "@/app/(associate)/events";

export default function PagerWithHeader() {
    return <TabbedPagerLayout
        labels={["Events", "Points"]}
        pages={[<AssociateEventsPage key="events"/>, <AssociatePointLeaderboard key="leaderboard" />]}
    />;
}