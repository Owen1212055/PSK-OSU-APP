import React from 'react';
import {Alert, Button, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import APIService from '@/api/APIService';

export default function ChangeProfilePicButton() {

    // 2) Launch picker, then call uploadProfilePicture
    const pickAndUpload = async () => {

    };

    return (
        <View style={{ margin: 16 }}>
            <Button title="Change Profile Picture" onPress={pickAndUpload} />
        </View>
    );
}
