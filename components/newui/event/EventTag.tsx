import React from "react";
import {StyleSheet, TextStyle, View, ViewProps, ViewStyle} from "react-native";
import {ThemedText} from "@/components/ThemedText";

export interface TagProps extends ViewProps {
    label: string;
    backgroundColor?: string;
    textColor?: string;
    icon?: React.ReactNode;
    textStyle?: TextStyle;
    containerStyle?: ViewStyle;
}

export const EventTag: React.FC<TagProps> = ({
                                            label,
                                            icon,
                                            backgroundColor = "rgba(0,0,0,0.05)",
                                            textColor = "#000",
                                            style,
                                            textStyle,
                                            containerStyle,
                                            ...rest
                                        }) => {
    return (
        <View
            style={[
                styles.container,
                {backgroundColor},
                containerStyle,
                style,
            ]}
            {...rest}
        >
            {icon && <View style={styles.iconWrapper}>{icon}</View>}
            <ThemedText style={[{color: textColor}, styles.text, textStyle]}>
                {label}
            </ThemedText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignSelf: "center",
        justifyContent: "center",
        gap: 4
    },
    iconWrapper: {
        marginRight: 4,
    },
    text: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: "600",
    },
});