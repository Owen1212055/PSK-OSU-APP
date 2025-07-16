import {StyleSheet, Text, type TextProps} from 'react-native';

import {useThemeColor} from '@/hooks/useThemeColor';
import {Colors} from "@/constants/Colors";

export type TextTheme = 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'subtitle_mini' | 'default_button' | "title_new" | "title_new_chunky" |
    "title_new_chunky_subtext" | "subtitle_new_chunky_subtext_heavy" | "navbar_location" | "title_new_chunky_subtext_heavy" | "navbar_header" | "profile_name" | "profile_username" | "content_header";

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: TextTheme;
    colorType?: keyof typeof Colors.light;
};

export function ThemedText({
                               style,
                               lightColor,
                               darkColor,
                               colorType = 'text',
                               type = 'default',
                               ...rest
                           }: ThemedTextProps) {
    let color = useThemeColor({light: lightColor, dark: darkColor}, colorType);
    if (type === 'title_new_chunky_subtext' || type === 'profile_username' || type === 'subtitle_new_chunky_subtext_heavy') {
        color = useThemeColor({light: lightColor, dark: darkColor}, 'subtitle');
    }
    return (
        <Text
            style={[
                {color},
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                type === 'subtitle_mini' ? styles.subtitle_mini : undefined,
                type === 'default_button' ? styles.default_button : undefined,
                type === 'title_new' ? styles.title_new : undefined,
                type === 'title_new_chunky' ? styles.title_new_chunky : undefined,
                type === 'title_new_chunky_subtext' ? styles.title_new_chunky_subtext : undefined,
                type === 'subtitle_new_chunky_subtext_heavy' ? styles.title_new_chunky_subtext_heavy : undefined,
                type === 'navbar_location' ? styles.navbar_location : undefined,
                type === 'title_new_chunky_subtext_heavy' ? styles.title_new_chunky_subtext_heavy : undefined,
                type === 'navbar_header' ? styles.navbar_header : undefined,
                type === 'profile_name' ? styles.profile_name : undefined,
                type === 'profile_username' ? styles.profile_username : undefined,
                type === 'content_header' ? styles.content_header : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16
    },
    default_button: {
        fontSize: 16,
        color: '#fff'
    },
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    subtitle_mini: {
        fontSize: 10,
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4',
    },
    title_new: {
        fontFamily: "Inter",
        fontSize: 24,
        fontWeight: "700",
        lineHeight: 32,
    },
    title_new_chunky: {
        fontFamily: "Inter",
        fontSize: 32,
        fontWeight: "700",
        lineHeight: 32,
    },
    content_header: {
        fontFamily: "Inter",
        fontSize: 16,
        fontWeight: "700"
    },
    title_new_chunky_subtext: {
        fontFamily: "Inter",
        fontSize: 14,
        fontWeight: 400,
    },
    title_new_chunky_subtext_heavy: {
        fontFamily: "Inter",
        fontSize: 14,
        fontWeight: 700,
    },
    navbar_header: {
        fontFamily: "Inter",
        fontSize: 16,
        fontWeight: 700,
    },
    navbar_location: {
        fontFamily: "Inter",
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 20,
    },
    profile_name: {
        fontSize: 16,
        fontWeight: "700"
    },
    profile_username: {
        fontSize: 14,
        fontWeight: "500"
    }
});
