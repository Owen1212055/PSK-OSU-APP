import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, View} from 'react-native';
import APIService from '@/api/APIService';
import {UserInfo} from "@/api/Entities";
import {
    Apple,
    Banana,
    Beer,
    CakeSlice,
    Cherry,
    Dessert,
    Egg, Heart,
    IceCream,
    Milk,
    Moon, Smile, Star,
    Sun,
    User,
    Wine
} from "lucide-react-native";

interface ProfilePictureProps {
    user?: UserInfo;
    profilePictureData?: string;
    uriOverride?: string;
    width?: number;
    height?: number;
}

const PFPS = [
    <Apple />,
    <Banana />,
    <Beer />,
    <CakeSlice />,
    <Cherry />,
    <Wine />,
    <IceCream />,
    <Egg />,
    <Dessert />,
    <Milk />,
    <Star />,
    <Heart />,
    <Smile />,
    <Sun />,
    <Moon />
]

const PASTEL_COLORS = [
    '#ea7286',
    '#eab281',
    '#e3e19f',
    '#a9c484',
    '#5d937b',
    '#a07ca7',
    '#f4a4bf',
    '#f5d1b6',
    '#d6cec2',
    '#a2a6a9',
    '#777f8f',
    '#a3b2d2',
    '#bfded8',
    '#bf796d',
    "#FFC09F",
    "#FFDFBA",
    "#FFB3BA",
    "#A0CED9",
    "#95B8D1",
    "#809BCE",
    "#B8E0D2",
    "#ADf7B6",
    "#EAC4D5",
    "#FFE5B4",
    "#D7E3FC",
    "#CCDBFD",
    "#AAF0D1",
    "#BFEFFF",
];


export default function ProfilePicture({user, profilePictureData, uriOverride, width = 32, height = 32}: ProfilePictureProps) {
    if (!user) {
        return <ActivityIndicator size={width} />;
    }

    if (!profilePictureData) {
        profilePictureData = user?.profilePicture;
    }

    if (!profilePictureData && !uriOverride) {
        const color = PASTEL_COLORS[user.id % PASTEL_COLORS.length];
        const fallbackIcon = PFPS[user.id % PFPS.length];

        return React.cloneElement(fallbackIcon, { width, height, strokeWidth: 1.5, color: color });
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
