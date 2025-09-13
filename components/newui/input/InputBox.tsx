import React from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';

interface InputBoxProps extends TextInputProps {
    label: string;
    trailing?: React.ReactNode;
}

export const InputBox: React.FC<InputBoxProps> = ({ label, trailing, ...textInputProps }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#888888"
                    autoCorrect={false}
                    autoCapitalize={"none"}
                    {...textInputProps}
                />
                {trailing && <View style={styles.trailing}>{trailing}</View>}
            </View>
        </View>
    );
};

function createStyles(theme: Theme) {
    return StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 4,
            alignSelf: 'stretch',
        },
        label: {
            color: color(theme, 'textPrimary'),
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: '500',
            lineHeight: 18,
        },
        inputRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
        },
        input: {
            flex: 1,
            minWidth: 0,
            color: color(theme, 'textPrimary'),
        },
        trailing: {
            marginLeft: 8,
        },
    });
}