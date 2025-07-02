import { StyleSheet, Dimensions } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");
const scale = width / 414; // Escala basada en un diseño de referencia de 414px de ancho

export const JuegoMemoramaStyles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#fdd295",
  },
  header: {
    backgroundColor: "#fcb550",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30 * scale,
    marginHorizontal: 10 * scale,
    paddingVertical: 10 * scale,
  },
  cajaTitulo: {
    marginVertical: 5 * scale,
  },
  titulo: {
    fontSize: RFPercentage(3.5), // Tamaño de fuente responsivo
    color: "#da7e01",
    fontFamily: "Quicksand",
  },
  cajaIconos: {
    flexDirection: "row",
    marginVertical: 5 * scale,
  },
  cajaNivel: {
    borderRadius: 90 * scale,
    backgroundColor: "#da7e01",
    alignItems: "center",
    justifyContent: "center",
    height: 46 * scale,
    width: 90 * scale,
  },
  Nivel: {
    fontSize: RFPercentage(2.5),
    color: "#FFD3B8",
    fontFamily: "Quicksand",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12 * scale,
  },
  cajaPuntajes: {
    flexDirection: "row",
    marginVertical: 5 * scale,
    backgroundColor: "#feddaf",
    borderRadius: 30 * scale,
    paddingHorizontal: 10 * scale,
  },
  puntajeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8 * scale,
  },
  icon: {
    marginRight: 5 * scale,
  },
  score: {
    fontSize: RFPercentage(3),
    color: "#da7e01",
    fontFamily: "Quicksand",
  },
  boardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fcb550",
    borderRadius: 15 * scale,
    marginHorizontal: 10 * scale,
    padding: 10 * scale,
    maxWidth: width * 0.9, // Limita el ancho del tablero
  },
});