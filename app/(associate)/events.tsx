import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import AttendancePoints from "@/components/newui/points/AttendancePoints";
import {TitledView} from "@/components/newui/TitledView";
import {LeaderboardEntry} from "@/components/newui/LeaderboardEntry";
import APIService from "@/api/APIService";
import {GradedEventScoreboardEntry, Role, UserInfo} from "@/api/Entities";
import {BubbleCard} from "@/components/newui/frame/BubbleCard";
import EventPage from "@/app/common/events";

export default function AssociateEventsPage() {
    return <EventPage activeFilter={(event) => event.requiredRoles.includes(Role.PLEDGE)} plannedFilter={(event) => event.requiredRoles.includes(Role.PLEDGE)}/>;
}