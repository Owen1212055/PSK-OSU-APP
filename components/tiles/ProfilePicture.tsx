import React, { useEffect, useState } from 'react';
import { Image, View, ActivityIndicator } from 'react-native';
import APIService from '@/api/APIService';

interface ProfilePictureProps {
    userId: number;
}

export default function ProfilePicture({userId}: ProfilePictureProps) {
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
                style={{ width: 32, height: 32, borderRadius: 64 }}
            />
        </View>
    );
}
