import { StyleSheet } from "react-native";

export const JuegoMemoramaStyles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#fdd295",
  },
  
  header: {
    backgroundColor: "#fcb550",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginHorizontal: 10,
    paddingVertical: 10,
  },

  cajaTitulo: {
    marginVertical: 5,
  },
  
  titulo: {
    fontSize: 24,
    color: '#da7e01',
    fontFamily: 'Quicksand',
  },
  
  cajaIconos: {
    flexDirection: 'row',
    marginVertical: 5,
  },

  cajaNivel: {
    borderRadius: 90,
    backgroundColor: '#da7e01',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    width: 90,
  },

  Nivel: {
    fontSize: 18,
    color: '#FFD3B8',
    fontFamily: 'Quicksand',
  },
  
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },

  cajaPuntajes: {
    flexDirection: 'row',
    marginVertical: 5,
  },

  puntajeContainer: {
    flexDirection: 'row', // Para alinear imagen y texto en la misma línea
    alignItems: 'center', // Para centrar la imagen y el texto verticalmente
    marginHorizontal: 10,
  },

  image: {
    width: 30,
    height: 30,
    marginRight: 5, // Espacio entre la imagen y el texto
  },
  
  score: {
    fontSize: 27,
    color: '#da7e01',
    fontFamily: 'Quicksand',
  },

  boardContainer: {
    flex: 1, // Ocupa todo el espacio disponible
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center', // Centra horizontalmente
  },

  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fcb550",
    borderRadius: 15,
    marginHorizontal: 10,
  },
});
