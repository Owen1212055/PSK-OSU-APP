import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, View} from 'react-native';
import APIService from '@/api/APIService';
import {UserInfo} from "@/api/Entities";

interface ProfilePictureProps {
    user?: UserInfo;
    profilePictureData?: string;
    uriOverride?: string;
    width?: number;
    height?: number;
}

export default function ProfilePicture({user, profilePictureData, uriOverride, width = 32, height = 32}: ProfilePictureProps) {
    if (!profilePictureData) {
        profilePictureData = user?.profilePicture;
    }

    if (profilePictureData === null) {
        return <ActivityIndicator />;
    }

    return (
        <View>
            <Image
                source={{uri: uriOverride ? uriOverride : `data:image/jpeg;base64,${profilePictureData}`}}
                style={{ width: width, height: height, borderRadius: 64 }}
            />
        </View>
    );
}
