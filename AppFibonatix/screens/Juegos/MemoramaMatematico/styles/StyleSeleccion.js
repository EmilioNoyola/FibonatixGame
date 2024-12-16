import { StyleSheet } from "react-native";

export const StyleSeleccion = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fdd295",
    },

    header: {
        backgroundColor: "#fea020",
        marginHorizontal: 10,
        paddingVertical: 20,
        borderRadius: 30,
        alignItems: 'center',
    },

    resetButton: {
        backgroundColor: "#d9534f",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },

    textoResetButton: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },

    textoTitulo: {
        fontSize: 30,
        color: '#a05f03',
        fontFamily: 'Quicksand',
        textTransform: 'uppercase',
    },

    levelsContainer: {
        backgroundColor: "#fcb550",
        borderRadius: 20,
        margin: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    levels: {

        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 20,
        borderRadius: 30,
        width: '100%',
        gap: 20,

    },

    boton: {
        paddingVertical: 15,
        paddingHorizontal: 78,
        borderRadius: 15,
        marginBottom: 10,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    textoBoton: {
    fontSize: 20,
    fontFamily: 'Quicksand',
    color: '#FFFFFF',
    },

    titulo: {
        fontSize: 20,
    },
});