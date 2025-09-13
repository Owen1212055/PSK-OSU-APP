import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    ActiveEvent, ActiveEventCategory, CheckInResponsePayload,
    GradedEventEntity, GradedEventEntry, GradedEventEntryWithBrother, GradedEventScoreboardEntry,
    Invite, PlannedEvent,
    AssociatePointEntry,
    AssociatePointStanding, ScoreResult,
    SetRolesPayload,
    SettingsPayload,
    UserInfo
} from "@/api/Entities";
import {Buffer} from "buffer";


interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
}


const API_BASE_URL = __DEV__ ?
    "http://fe552c0ae77f.ngrok.app/api" :
    "http://psk-backend.owen1212055.com/api";


class APIService {
    // Utility method to retrieve token and build header
    private async getAuthHeaders(): Promise<{ Authorization: string }> {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }
        return { Authorization: `Bearer ${token}` };
    }

    // Generic authorized GET
    private async authGet<T>(url: string): Promise<T> {
        const headers = await this.getAuthHeaders();
        const response: AxiosResponse<T> = await axios.get<T>(url, { headers });
        return response.data;
    }

    private async authPost<T>(url: string, data?: any, axiosConfig: AxiosRequestConfig = {}): Promise<T> {
        const authHeaders = await this.getAuthHeaders();
        const { headers: userHeaders = {}, ...rest } = axiosConfig;

        const headers = {...authHeaders, ...userHeaders};
        const finalConfig: AxiosRequestConfig = {...rest, headers};

        const resp = await axios.post<T>(url, data, finalConfig);
        return resp.data;
    }

    private async authPut<T>(url: string, data?: any): Promise<T> {
        const headers = await this.getAuthHeaders();
        const response: AxiosResponse<T> = await axios.put<T>(url, data, { headers });
        return response.data;
    }

    private async authDelete<T>(url: string): Promise<T> {
        const headers = await this.getAuthHeaders();
        const response: AxiosResponse<T> = await axios.delete<T>(url,{ headers });
        return response.data;
    }


    register(payload: { password: string; username: string; inviteCode: string }) {
        return axios.post<LoginResponse>(`${API_BASE_URL}/session/register`, payload);
    }

    login(payload: { password: string; username: string }) {
        return axios.post<LoginResponse>(`${API_BASE_URL}/session/login`, payload);
    }

    changePassword(payload: { password: string; newPassword: string; confirmPassword: string }) {
        return this.authPost<string>(`${API_BASE_URL}/users/me/reset-password`, payload);
    }

    async me(): Promise<UserInfo> {
        return this.authGet<UserInfo>(`${API_BASE_URL}/users/me`);
    }

    async updateSettings(payload: SettingsPayload): Promise<UserInfo> {
        return this.authPost<UserInfo>(`${API_BASE_URL}/users/me`, payload);
    }

    // Users
    async getScore(id:number): Promise<ScoreResult> {
        return this.authGet<ScoreResult>(`${API_BASE_URL}/gradedevents/score/${id}`);
    }

    async getAllUsers(): Promise<UserInfo[]> {
        return this.authGet<UserInfo[]>(`${API_BASE_URL}/users/all`);
    }

    async getUser(id: number): Promise<UserInfo> {
        return this.authGet<UserInfo>(`${API_BASE_URL}/users/user/${id}`);
    }

    async removeUser(id: number): Promise<UserInfo> {
        return this.authDelete<UserInfo>(`${API_BASE_URL}/users/user/${id}`);
    }

    async modifyRole(id: number, payload: SetRolesPayload): Promise<UserInfo> {
        return this.authPost<UserInfo>(`${API_BASE_URL}/users/user/${id}/roles`, payload);
    }

    async uploadProfilePicture(fileUri: string, mimeType = "image/jpeg"): Promise<void> {
        const form = new FormData();
        form.append("file", {uri: fileUri, name: fileUri.split("/").pop(), type: mimeType} as any);

        await this.authPost(`${API_BASE_URL}/users/me/profile`, form, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );
    }

    async getProfilePicture(id: number): Promise<string | null> {
        const headers = await this.getAuthHeaders();
        try {
            const response: AxiosResponse<ArrayBuffer> = await axios.get(
                `${API_BASE_URL}/users/user/${id}/profile`,
                {
                    headers,
                    responseType: 'arraybuffer',
                }
            );

            if (!response.data || response.data.byteLength === 0) {
                return null;
            }

            const b64 = Buffer.from(response.data).toString('base64');
            return `data:image/jpeg;base64,${b64}`;
        } catch (err: any) {
            if (err.response?.status === 204) {
                return null;
            }
            throw err;
        }
    }

    // Invites API
    async getAllInvites(): Promise<Invite[]> {
        return this.authGet<Invite[]>(`${API_BASE_URL}/invites`);
    }

    async getInviteById(id: number): Promise<Invite> {
        return this.authGet<Invite>(`${API_BASE_URL}/invites/${id}`);
    }

    async createInvite(payload: { code: string; maxUses: number; expiresAt: string }): Promise<Invite> {
        return this.authPost<Invite>(`${API_BASE_URL}/invites`, payload);
    }

    async updateInvite(id: number, payload: { code: string; maxUses: number; expiresAt: string }): Promise<Invite> {
        return this.authPost<Invite>(`${API_BASE_URL}/invites/${id}`, payload);
    }

    async deleteInvite(id: number): Promise<void> {
        await this.authDelete<void>(`${API_BASE_URL}/invites/${id}`);
    }

    // Associate Points API
    async getAllAssociatePoints(): Promise<AssociatePointStanding[]> {
        return this.authGet<AssociatePointStanding[]>(`${API_BASE_URL}/associatepoints`);
    }

    async getAssociatePointsLeaderboard(): Promise<GradedEventScoreboardEntry[]> {
        return this.authGet<GradedEventScoreboardEntry[]>(`${API_BASE_URL}/associatepoints/scores`);
    }

    async getAllPledgePointRequests(): Promise<AssociatePointEntry[]> {
        return this.authGet<AssociatePointEntry[]>(`${API_BASE_URL}/pledgepoint-requests`);
    }

    async createPledgePointRequest(request: Pick<AssociatePointEntry, "reason" | "points" | "pledgeId">): Promise<AssociatePointEntry> {
        return this.authPost<AssociatePointEntry>(`${API_BASE_URL}/pledgepoint-requests`, request);
    }

    async approvePledgePointRequest(id: number): Promise<AssociatePointEntry> {
        return this.authPut<AssociatePointEntry>(`${API_BASE_URL}/pledgepoint-requests/${id}/approve`);
    }

    async denyPledgePointRequest(id: number): Promise<AssociatePointEntry> {
        return this.authPut<AssociatePointEntry>(`${API_BASE_URL}/pledgepoint-requests/${id}/deny`);
    }

    async deletePledgePointRequest(id: number): Promise<void> {
        return this.authDelete<void>(`${API_BASE_URL}/pledgepoint-requests/${id}`);
    }

    // historical events
    async getAllPlannedEvents(): Promise<PlannedEvent[]> {
        return this.authGet<PlannedEvent[]>(`${API_BASE_URL}/events/planned`);
    }

    async getPlannedEvent(id: string): Promise<PlannedEvent> {
        return this.authGet<PlannedEvent>(`${API_BASE_URL}/events/planned/${id}`);
    }

    async getGradedEventsScoreboard(): Promise<GradedEventScoreboardEntry[]> {
        return this.authGet<GradedEventScoreboardEntry[]>(`${API_BASE_URL}/gradedevents/scores`);
    }

    async getAllGradedEvents(): Promise<GradedEventEntity[]> {
        return this.authGet<GradedEventEntity[]>(`${API_BASE_URL}/gradedevents`);
    }

    async getGradedEventById(id: number): Promise<GradedEventEntity> {
        return this.authGet<GradedEventEntity>(`${API_BASE_URL}/gradedevents/${id}`);
    }

    async createGradedEvent(event: Partial<GradedEventEntity>): Promise<GradedEventEntity> {
        return this.authPost<GradedEventEntity>(`${API_BASE_URL}/gradedevents`, event);
    }

    async updateGradedEvent(id: number, event: Partial<GradedEventEntity>): Promise<GradedEventEntity> {
        return this.authPut<GradedEventEntity>(`${API_BASE_URL}/gradedevents/${id}`, event);
    }

    async updateGradedEventEntry(eventId: number, entryId: number, entry: Partial<GradedEventEntry>): Promise<GradedEventEntry> {
        console.log(entry);
        return this.authPut<GradedEventEntry>(`${API_BASE_URL}/gradedevents/${eventId}/entries/${entryId}`, entry);
    }

    async populateGradedEvent(eventId: number, brotherIds: number[]): Promise<GradedEventEntity> {
        return this.authPut<GradedEventEntity>(`${API_BASE_URL}/gradedevents/${eventId}/populate`, brotherIds);
    }

    // New method to get entries for a given graded event.
    async getGradedEventEntries(eventId: number): Promise<GradedEventEntryWithBrother[]> {
        return this.authGet<GradedEventEntryWithBrother[]>(`${API_BASE_URL}/gradedevents/${eventId}/entries`);
    }

    async getActiveEvents(): Promise<ActiveEvent[]> {
        return this.authGet<ActiveEvent[]>(`${API_BASE_URL}/activeevents`);
    }

    async deleteGradedEvent(eventId: number) {
        return this.authDelete(`${API_BASE_URL}/gradedevents/${eventId}`);
    }

    async checkInActiveEvent(
        eventId: number,
        latitude: number,
        longitude: number,
    ): Promise<CheckInResponsePayload> {
        return this.authPost<CheckInResponsePayload>(
            `${API_BASE_URL}/activeevents/${eventId}/checkin`, {latitude: latitude, longitude: longitude}
        );
    }

    async getCategories(){
        return this.authGet<ActiveEventCategory[]>(
            `${API_BASE_URL}/activeevents/categories`,
        );
    }

}

export default new APIService()