import {StyleSheet, TouchableOpacity, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {SlidersHorizontal} from "lucide-react-native";
import React from "react";
import {UserInfo} from "@/api/Entities";
import {GestureResponderEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {usePredefined} from "@/hooks/useThemeColor";


type Props = {
    pledge: UserInfo;
    score: number;
    callback: (event: GestureResponderEvent) => void;
};

export function PledgePointEntry({ pledge, score, callback }: Props) {

    const color = usePredefined('border_color');

    return (<View style={[styles.row, {borderColor: color}]}>
            {/* Left: Name */}
            <View style={styles.leftBox}>
                <ThemedText>{pledge.username}</ThemedText>
            </View>

            {/* Right: Score & "modify" icon */}
            <View style={styles.rightBox}>
                <ThemedText>{score}</ThemedText>
                <TouchableOpacity onPress={callback}>
                    <SlidersHorizontal size={20}/>
                </TouchableOpacity>
            </View>
        </View>)
}

const styles = StyleSheet.create({
    row: {
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        width: '100%'
    },
    leftBox: {
        paddingLeft: 5,
        justifyContent: 'center',
    },
    rightBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingRight: 10,
    },
    score: {
        fontWeight: '600',
        fontSize: 16,
    }
});
