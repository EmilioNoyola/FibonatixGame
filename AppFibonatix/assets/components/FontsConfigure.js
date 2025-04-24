// useCustomFonts.js
import { useFonts } from "expo-font";
import { useEffect, useCallback } from "react";
import * as SplashScreen from 'expo-splash-screen';

export default function useCustomFonts() {
    // Cargar las fuentes
    const [fontsLoaded] = useFonts({
        Quicksand: require("../fonts/Quicksand-Bold.ttf"),
        Quicksand_Regular: require('../fonts/Quicksand-Regular.ttf'),
        Quicksand_Medium: require('../fonts/Quicksand-Medium.ttf'),
        Quicksand_SemiBold: require('../fonts/Quicksand-SemiBold.ttf'),
    });

    // Evitar que la pantalla de splash desaparezca hasta que las fuentes estén cargadas
    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
        }
        prepare();
    }, []);

    // Callback para ocultar la pantalla de splash cuando las fuentes se hayan cargado
    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    return { fontsLoaded, onLayoutRootView };
}
