import React from 'react';
import {GestureResponderEvent, StyleProp, TextStyle, TouchableOpacity} from 'react-native';
import {ThemedText, ThemedTextProps} from "@/components/ThemedText";

type ClickableThemedTextProps = Omit<ThemedTextProps, 'onPress'> & {
    onPress?: (event: GestureResponderEvent) => void;
    style?: StyleProp<TextStyle>;
};

export function ClickableThemedText({onPress, ...props}: ClickableThemedTextProps) {
    return (
        <TouchableOpacity onPress={onPress} disabled={!onPress}>
            <ThemedText {...props} />
        </TouchableOpacity>
    );
}
