import { StyleSheet, Dimensions } from "react-native";
import { RFPercentage } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get("window");
const scale = width / 414;

export const StyleSeleccion = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fdd295",
    },
    header: {
        backgroundColor: "#fea020",
        marginHorizontal: 10 * scale,
        paddingVertical: 20 * scale,
        borderRadius: 30 * scale,
        alignItems: "center",
    },
    textoTitulo: {
        fontSize: RFPercentage(4),
        color: "#a05f03",
        fontFamily: "Quicksand",
        textTransform: "uppercase",
    },
    levelsContainer: {
        backgroundColor: "#fcb550",
        borderRadius: 20 * scale,
        margin: 10 * scale,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    levels: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: 20 * scale,
        borderRadius: 30 * scale,
        width: "100%",
        gap: 20 * scale,
    },
    boton: {
        paddingVertical: 15 * scale,
        paddingHorizontal: 78 * scale,
        borderRadius: 15 * scale,
        marginBottom: 10 * scale,
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
    },
    textoBoton: {
        fontSize: RFPercentage(3),
        fontFamily: "Quicksand",
        color: "#FFFFFF",
    },
});