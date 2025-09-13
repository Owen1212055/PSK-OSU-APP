import React, {memo} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import {color, inverseColor, Theme, useTheme} from '@/hooks/useThemeColor';

const PILL_WIDTH = 103;
const PILL_HEIGHT = 43;
const PILL_SPACING = 0;
const HEADER_PAD_LEFT = 0;
const HEADER_PAD_VERTICAL = 0;

interface Props {
    labels: string[];
    scrollX: Animated.AnimatedInterpolation<number>;
    onTabPress: (index: number) => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const PillHeader: React.FC<Props> = ({labels, scrollX, onTabPress}) => {
    const theme = useTheme();
    const styles = useStyles(theme);


    const translateX = scrollX.interpolate({
        inputRange: [0, labels.length - 1],
        outputRange: [0, (PILL_WIDTH + PILL_SPACING) * (labels.length - 1)],
        extrapolate: 'clamp',
    });


    return (
        <View style={styles.container}>
            {/* ───────────── Touchable Labels ───────────── */}
            <View style={styles.row}>
                {labels.map((label, i) => (
                    <TouchableOpacity
                        key={label}
                        style={styles.pill}
                        onPress={() => onTabPress(i)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.text, {color: color(theme, 'textPrimary')}]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* ───────── Masked highlight (no pointer capture) ───────── */}
            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                <MaskedView
                    style={StyleSheet.absoluteFill}
                    maskElement={
                        <AnimatedView
                            style={[
                                styles.mask,
                                {transform: [{translateX}]},
                            ]}
                        />
                    }
                >
                    {/* Highlight background */}
                    <View
                        style={[
                            StyleSheet.absoluteFillObject,
                            {backgroundColor: color(theme, 'accent')},
                        ]}
                    />
                    {/* Inverted labels */}
                    <View style={styles.overlayRow}>
                        {labels.map((label) => (
                            <View key={label} style={styles.pill}>
                                <Text style={[styles.text, {color: inverseColor(theme, 'textPrimary')}]}>{label}</Text>
                            </View>
                        ))}
                    </View>
                </MaskedView>
            </View>
        </View>
    );
};

export default memo(PillHeader);

function useStyles(theme: Theme) {
    return StyleSheet.create({
        container: {
            paddingLeft: HEADER_PAD_LEFT,
            paddingVertical: HEADER_PAD_VERTICAL,
        },
        row: {
            flexDirection: 'row',
        },
        overlayRow: {
            flexDirection: 'row',
            paddingLeft: HEADER_PAD_LEFT,
            paddingVertical: HEADER_PAD_VERTICAL,
        },
        pill: {
            width: PILL_WIDTH,
            height: PILL_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: PILL_SPACING,
        },
        text: {
            fontSize: 16,
            fontWeight: '700',
        },
        mask: {
            position: 'absolute',
            top: HEADER_PAD_VERTICAL,
            left: HEADER_PAD_LEFT,
            width: PILL_WIDTH,
            height: PILL_HEIGHT,
            borderRadius: PILL_HEIGHT / 2,
            backgroundColor: '#000',
        },
    });
}