import React, { useCallback, useMemo, useRef } from "react";
import { Animated, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import { color, Theme, useTheme } from "@/hooks/useThemeColor";
import { Settings2Icon } from "lucide-react-native";
import { router } from "expo-router";
import { useThemeCtx } from "@/contexts/ThemeProvider";
import Events from "@/app/(new_app)/events";
import PillHeader from "@/app/layout/PillHeader";
import {SafeAreaView} from "react-native-safe-area-context";

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

type TabbedPagerLayoutProps = {
    labels: string[];
    pages: React.ReactNode[];
    initialPage?: number;
    headerRight?: React.ReactNode;
};

export default function TabbedPagerLayout({
                                              labels,
                                              pages,
                                              initialPage = 0,
                                              headerRight,
                                          }: TabbedPagerLayoutProps) {
    const theme = useTheme();
    const styles = useStyles(theme);
    const { effective } = useThemeCtx();

    const pos = useRef(new Animated.Value(0)).current;
    const off = useRef(new Animated.Value(0)).current;
    const scrollX = Animated.add(pos, off);

    const onPageScroll = Animated.event(
        [{ nativeEvent: { position: pos, offset: off } }],
        { useNativeDriver: true }
    );

    const pagerRef = useRef<PagerView>(null);
    const goTo = useCallback((idx: number) => pagerRef.current?.setPage(idx), []);

    const openSettings = () => {
        router.push("/(modals)/settings/dashboard");
    };


    return (
        <View style={styles.root}>
            <SafeAreaView>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Image style={styles.image} source={effective == 'light' ? require('../../assets/images/psk_title_black.png') : require('../../assets/images/psk_title.png')}/>
                        <View style={styles.icons}>
                            {/*<BellIcon color={color(useTheme(), 'icon_color')}/>*/}
                            <TouchableOpacity onPress={openSettings}>
                                <Settings2Icon color={color(useTheme(), 'icon_color')}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <PillHeader
                        labels={labels}
                        scrollX={scrollX}
                        onTabPress={goTo}
                    />
                </View>
            </SafeAreaView>

            <AnimatedPagerView
                ref={pagerRef}
                initialPage={0}
                onPageScroll={onPageScroll}
                style={styles.pager}
            >
                {pages.map((TabComponent, index) => (
                    <ScrollView key={index} style={styles.pager_content} bounces={false}>
                        <SafeAreaView>
                            {TabComponent}
                        </SafeAreaView>
                    </ScrollView>
                ))}
            </AnimatedPagerView>
        </View>
    );
}

function useStyles(theme: Theme) {
    return StyleSheet.create({
        root: {
            flex: 1,
            flexDirection: "column",
            backgroundColor: color(theme, 'background'),
            gap: 24
        },
        content: {
            padding: 16
        },
        image: {
            width: 64,
            height: 34
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: '100%',
            marginBottom: 24
        },
        icons: {
            alignItems: "center",
            flexDirection: "row",
            gap: 16
        },
        pager: {
            flex: 1,
        },
        pager_content: {
            paddingHorizontal: 16
        }
    });
}
