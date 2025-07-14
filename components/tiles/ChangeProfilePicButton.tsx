import React, { useEffect } from 'react';
import { Button, Alert, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import APIService from '@/api/APIService';

export default function ChangeProfilePicButton() {

    // 2) Launch picker, then call uploadProfilePicture
    const pickAndUpload = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 0.5,
                allowsEditing: true,
                aspect: [1, 1],

            });

            if (result.canceled) {
                return;
            }

            // expo v14+: result.assets is an array
            const asset = result.assets[0];
            const uri = asset.uri;

            // Upload (assumes JPEG; adjust if you support PNG)
            await APIService.uploadProfilePicture(uri, 'image/jpeg');
            Alert.alert('Success', 'Profile picture updated!');
        } catch (err: any) {
            console.error(err);
            Alert.alert('Upload failed', err.message || 'Unknown error');
        }
    };

    return (
        <View style={{ margin: 16 }}>
            <Button title="Change Profile Picture" onPress={pickAndUpload} />
        </View>
    );
}
