import React from 'react';
import {StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View} from 'react-native';
import {color, Theme, useTheme} from '@/hooks/useThemeColor';
import {LucideProps} from "lucide-react-native";

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
        <TouchableOpacity style={styles.button} {...props}>
            {renderedIcon}
            <View style={styles.text_content}>
                <Text style={styles.header}>{title}</Text>
                {subtitle && <Text style={styles.description}>{subtitle}</Text>}
            </View>
        </TouchableOpacity>
    );
};

function createStyles(theme: Theme) {
    return StyleSheet.create({
        button: {
            display: 'flex',
            paddingVertical: 16,
            paddingHorizontal: 24,
            gap: 16,
            alignSelf: "stretch",
            alignItems: "center",
            flexDirection: "row",
            borderRadius: 32,
            borderColor: 'rgba(0, 0, 0, 0.10)',
            borderWidth: 2,
            borderStyle: "solid",
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
