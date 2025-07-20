import React from 'react';
import {StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View} from 'react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';
import {LucideProps} from "lucide-react-native";
import {BubbleFrame} from "@/components/newui/frame/OutlinedBubbleFrame";

interface SymbolButtonProps extends TouchableOpacityProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactElement<LucideProps>;
}

export const SymbolButton: React.FC<SymbolButtonProps> = ({title, icon, subtitle, ...props}) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const renderedIcon =
        icon && React.cloneElement(icon, {
            width: icon.props.width ?? 24,
            height: icon.props.height ?? 24,
            strokeWidth: icon.props.strokeWidth ?? 2.667,
            color: icon.props.color ?? color(theme, 'icon_color'),
        });

    return (
        <TouchableOpacity style={styles.touch} {...props}>
            <BubbleFrame>
                <View style={styles.container}>
                    {renderedIcon}
                    <View style={styles.text_content}>
                        <Text style={styles.header}>{title}</Text>
                        {subtitle && <Text style={styles.description}>{subtitle}</Text>}
                    </View>
                </View>
            </BubbleFrame>
        </TouchableOpacity>
    );
};

function createStyles(theme: Theme) {
    return StyleSheet.create({
        touch: {
            alignSelf: "stretch"
        },
        container: {
            gap: 16,
            alignSelf: "stretch",
            alignItems: "center",
            flexDirection: "row"
        },
        iconWrapper: {
            width: 24,
            height: 24
        },
        text: {
            color: color(theme, 'textPrimary'),
            textAlign: 'center',
            fontFamily: 'Inter',
            fontSize: 16,
            fontWeight: '700',
            lineHeight: 20,
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
        }
    });
}
