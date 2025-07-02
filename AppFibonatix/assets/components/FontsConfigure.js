// Configuración de la fuente Quicksand.
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from "expo-font";
import { useEffect, useCallback } from "react";

export default function useCustomFonts() {

    const [fontsLoaded] = useFonts({
        Quicksand: require("../fonts/Quicksand-Bold.ttf"),
        Quicksand_Regular: require('../fonts/Quicksand-Regular.ttf'),
        Quicksand_Medium: require('../fonts/Quicksand-Medium.ttf'),
        Quicksand_SemiBold: require('../fonts/Quicksand-SemiBold.ttf'),
    });

    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
        }
        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    return { fontsLoaded, onLayoutRootView };
}
