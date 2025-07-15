import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, View} from 'react-native';
import APIService from '@/api/APIService';

interface ProfilePictureProps {
    userId: number;
    width?: number;
    height?: number;
}

export default function ProfilePicture({userId, width = 32, height = 32}: ProfilePictureProps) {
    const [uri, setUri] = useState<string | null>(null);
    useEffect(() => {
        APIService.getProfilePicture(userId)
            .then(setUri)
            .catch(console.error);
    }, []);

    if (uri === null) {
        return <ActivityIndicator />;
    }

    return (
        <View>
            <Image
                source={{ uri }}
                style={{ width: width, height: height, borderRadius: 64 }}
            />
        </View>
    );
}
