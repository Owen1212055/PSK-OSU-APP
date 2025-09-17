import { ExpoConfig, ConfigContext } from '@expo/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "PSK-OSU",
    slug: "PSK-OSU",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/main.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
        icon: "./assets/app.icon",
        supportsTablet: true,
        bundleIdentifier: "com.owen1212055.pskosu",
        buildNumber: process.env.NEW_BUILD_NUMBER,
        infoPlist: {
            NSAppTransportSecurity: {
                NSAllowsArbitraryLoads: true
            },
            ITSAppUsesNonExemptEncryption: false
        }
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#ffffff"
        },
        permissions: [
            "android.permission.ACCESS_FINE_LOCATION",
            "android.permission.ACCESS_COARSE_LOCATION",
            "android.permission.ACCESS_BACKGROUND_LOCATION"
        ],
        package: "com.owen1212055.pskosu",
        versionCode: parseInt(process.env.NEW_BUILD_NUMBER) || 1
    },
    plugins: [
        "expo-router",
        [
            "expo-splash-screen",
            {
                image: "./assets/images/psk_title.png",
                imageWidth: 200,
                resizeMode: "native",
                backgroundColor: "#FF1C3D",
                dark: {
                    backgroundColor: "#821020"
                }
            }
        ],
        [
            "expo-location",
            {
                locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location."
            }
        ],
        "expo-font",
        "expo-web-browser"
    ],
    experiments: {
        typedRoutes: true
    },
    extra: {
        router: {
            origin: false
        },
        eas: {
            projectId: "a8dc656a-0505-4588-9900-f890f9b65f96"
        },
        commitHash: process.env.GIT_COMMIT_HASH ?? 'unknown',
    }
});