import React from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, TouchableOpacityProps, View} from 'react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';
import {LucideProps} from "lucide-react-native";
import { BubbleFrame } from '../frame/OutlinedBubbleFrame';

interface RoundedInputBoxProps extends TextInputProps {
    disabled?: boolean
}

export const RoundedInputBox: React.FC<RoundedInputBoxProps> = ({disabled = false, ...textInputProps }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <BubbleFrame>
            <View style={styles.inputRow}>
                <TextInput
                    style={disabled ? styles.input_disabled : styles.input}
                    placeholderTextColor="#888888"
                    autoCorrect={false}
                    editable={!disabled}
                    {...textInputProps}
                />
            </View>
        </BubbleFrame>
    );
};

function createStyles(theme: Theme) {
    return StyleSheet.create({
        inputRow: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        },
        input: {
            flex: 1,
            minWidth: 0,
            color: color(theme, 'textPrimary'),
        },
        input_disabled: {
            flex: 1,
            minWidth: 0,
            color: color(theme, 'subtitle'),
        },
    });
}
