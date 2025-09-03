import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { TopBanner } from "@/components/newui/util/TopBanner";

export type BannerVariant = "info" | "success" | "warning" | "error";

type Banner = {
    message: string;
    variant?: BannerVariant;
} | null;

type BannerContextValue = {
    showBanner: (message: string, variant?: BannerVariant) => void;
    hideBanner: () => void;
    current: Banner;
};

const BannerContext = createContext<BannerContextValue | null>(null);

export const BannerProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [current, setCurrent] = useState<Banner>(null);

    const showBanner = useCallback((message: string, variant?: BannerVariant) => {
        setCurrent(prev => {
            // idempotent: if same content, no state change → no flicker
            if (prev && prev.message === message && prev.variant === variant) return prev;
            return { message, variant };
        });
    }, []);

    const hideBanner = useCallback(() => {
        setCurrent(prev => (prev === null ? prev : null));
    }, []);

    const value = useMemo<BannerContextValue>(
        () => ({ showBanner, hideBanner, current }),
        [showBanner, hideBanner, current]
    );

    return (
        <BannerContext.Provider value={value}>
            <View style={styles.root}>
                {current ? (
                    <TopBanner message={current.message} />
                ) : null}
                {children}
            </View>
        </BannerContext.Provider>
    );
};

export const useBanner = () => {
    const ctx = useContext(BannerContext);
    if (!ctx) throw new Error("useBanner must be used within a BannerProvider");
    return ctx;
};

const styles = StyleSheet.create({
    root: { flex: 1 },
});