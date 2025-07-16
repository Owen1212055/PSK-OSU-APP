import React from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, TouchableOpacityProps, View} from 'react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';
import {LucideProps} from "lucide-react-native";

interface RoundedInputBoxProps extends TextInputProps {
    disabled?: boolean
}

export const RoundedInputBox: React.FC<RoundedInputBoxProps> = ({disabled = false, ...textInputProps }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.button}>
            <View style={styles.inputRow}>
                <TextInput
                    style={disabled ? styles.input_disabled : styles.input}
                    placeholderTextColor="#888888"
                    autoCorrect={false}
                    editable={!disabled}
                    {...textInputProps}
                />
            </View>
        </View>
    );
};

function createStyles(theme: Theme) {
    return StyleSheet.create({
        button: {
            paddingVertical: 16,
            paddingHorizontal: 24,
            gap: 16,
            alignSelf: "stretch",
            alignItems: "center",
            flexDirection: "row",
            borderRadius: 32,
            borderColor: 'rgba(0, 0, 0, 0.10)',
            borderWidth: 2,
            borderStyle: "solid"
        },
        iconWrapper: {
            width: 24,
            height: 24
        },
        inputRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        },
        text_content: {
            flexDirection: "column"
        },
        header: {
            fontSize: 16,
            fontWeight: 700,
            color: color(theme, 'text')
        },
        description: {
            fontSize: 14,
            fontWeight: 500,
            color: color(theme, 'subtitle')
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
