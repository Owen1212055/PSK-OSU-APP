import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Animated,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import PagerView from 'react-native-pager-view';
import PillHeader from './PillHeader';
import Leaderboard from './leaderboard';
import {color, Theme, useTheme} from "@/hooks/useThemeColor";
import {BellIcon, Settings2Icon} from "lucide-react-native";
import ThirdTab from "@/app/(new_app)/thirdTab";
import {router} from "expo-router";
import Events from "@/app/(new_app)/events";
import {useThemeCtx} from "@/contexts/ThemeProvider";
import {TopBanner} from "@/components/newui/util/TopBanner";
import {ActiveEvent, PlannedEvent} from "@/api/Entities";
import APIService from "@/api/APIService";

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const PAGE_COUNT = 3;

export default function PagerWithHeader() {
    const styles = useStyles(useTheme());
    const pos = useRef(new Animated.Value(0)).current;
    const off = useRef(new Animated.Value(0)).current;
    const scrollX = Animated.add(pos, off);

    const onPageScroll = Animated.event(
        [{nativeEvent: {position: pos, offset: off}}],
        {useNativeDriver: true}
    );

    const pagerRef = useRef<PagerView>(null);
    const goTo = useCallback((idx: number) => {
        pagerRef.current?.setPage(idx);
    }, []);
    const tabComponents = [<Events/>, <Leaderboard/>, <ThirdTab/>];
    const openSettings = () => {
        router.push("/(modals)/settings/dashboard");
    };

    const { effective } = useThemeCtx();

    const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([]);
    useEffect(() => {
        // TODO: remove
        setInterval(() => {

            APIService.getActiveEvents().then((me) => {
                setActiveEvents(me);
            });
        }, 5000); // every 5 seconds refresh it
    }, []);

    return (
        <View style={styles.root}>
            {activeEvents.length > 0 && <TopBanner message={"You are ALL DEAD"}/>}
            <SafeAreaView>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Image style={styles.image} source={effective == 'light' ? require('../../assets/images/psk_title_black.png') : require('../../assets/images/psk_title.png')}/>
                        <View style={styles.icons}>
                            <BellIcon color={color(useTheme(), 'icon_color')}/>
                            <TouchableOpacity onPress={openSettings}>
                                <Settings2Icon color={color(useTheme(), 'icon_color')}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <PillHeader
                        labels={['Events', 'Points', 'Polls']}
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
                {tabComponents.map((TabComponent, index) => (
                    <ScrollView key={index} style={styles.pager_content}>
                        {TabComponent}
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
