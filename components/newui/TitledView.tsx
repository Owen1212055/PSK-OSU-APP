import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TextTheme, ThemedText} from '@/components/ThemedText';
import {Theme, useTheme} from '@/hooks/useThemeColor';

interface TitledViewProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    titleTheme?: TextTheme;
    subtitleTheme?: TextTheme;
    headerIcon?: React.ReactNode;
}

export const TitledView: React.FC<TitledViewProps> = ({
                                                          title,
                                                          subtitle,
                                                          children,
                                                          titleTheme = "title_new_chunky",
                                                          subtitleTheme = "title_new_chunky_subtext",
                                                          headerIcon
                                                      }) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.header_text}>
                    {headerIcon}
                    <ThemedText type={titleTheme}>{title}</ThemedText>
                </View>
                {subtitle && <ThemedText type={subtitleTheme}>{subtitle}</ThemedText>}
            </View>
            {children}
        </View>
    );
};

function useStyles(theme: Theme) {
    return StyleSheet.create({
        container: {
            flexDirection: 'column',
            gap: 8,
        },
        header: {
            flexDirection: 'column'
        },
        header_text: {
            gap: 4,
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center"

        }
    });
}
