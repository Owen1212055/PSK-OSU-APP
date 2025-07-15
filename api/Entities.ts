
export enum Role {
    EXEC = "EXEC",
    BROTHER = "BROTHER",
    PLEDGE = "PLEDGE",
}

export interface UserInfo {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    roles: Role[];
    profilePicture: string;
}

export function getName(this: UserInfo): string {
    return this.firstName && this.firstName.trim().length > 0 ? this.firstName : this.username;
}

export interface SettingsPayload {
    firstName: string;
    lastName: string;
}

export interface Invite {
    id: number;
    code: string;
    maxUses: number;
    expiresAt: string;
    usedBy: UserInfo[];
}

export interface PledgePointEntry {
    id: number;
    brotherId: number;
    pledgeId: number;
    points: number;
    status: "PENDING" | "APPROVED" | "DENIED";
    reason: string;
}

export interface PledgePointStanding {
    user: UserInfo;
    pledgePoints: PledgePointEntry[];
}

export interface SetRolesPayload {
    roles: Role[];
}

export interface GradedEventEntry {
    id: number;
    brotherId: number;
    scoreOverride: number;
    scoreName: string | undefined;
}

export interface GradedEventEntity {
    id: number;
    eventName: string;
    eventDesc: string;
    maxPointOverride: number;
    eventDate: string; // ISO string date
    eventType: string;
}

export interface GradedEventEntryWithBrother {
    entry: GradedEventEntry
    brother: UserInfo
}

export type CheckInState = 'ON_TIME' | 'LATE' | 'ABSENT';

export interface ActiveEvent {
    id: number;
    eventName: string;
    eventDesc: string;
    startTime: string; // ISO string date
    endTime: string;   // ISO string date
    location: string;
    latitude: number;
    longitude: number;
    checkedIn: Map<number, CheckInState>;
}

export interface CheckInResponsePayload {
    success: boolean;
    status: string;
}


export interface ActiveEventCategoryEntry {
    points: number;
    name: string;
}

export interface ActiveEventCategory {
    name: string;
    maxPoints: number;
    passes: number;
    entries: ActiveEventCategoryEntry[];
}

export interface ScoreResult {
    percent: number;
    min: number;
    max: number;
}