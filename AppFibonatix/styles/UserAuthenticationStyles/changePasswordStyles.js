import { StyleSheet } from "react-native";

export const changePasswordStyles = StyleSheet.create({
    main: {
        flex: 1, // para que el contenido abarque toda la pantalla
        backgroundColor: '#B1F6C3', //cambia el color del fondo principal
    },
    container: {
        flex: 1, // para que el contenido abarque toda la pantalla
        backgroundColor: '#B1F6C3', //cambia el color del fondo principal 
    },
    backgroundImage: {
        flex: 1, // para que el contenido abarque toda la pantalla
        resizeMode: 'contain', //ajusta el contenido de la imagen a toda la pantalla
        position: 'absolute', //hace que un elemento pueda moverse libremente segun las propiedades que se le indiquen
        opacity: 0.7, // coloca una opacidad al fondo
        top: 0, //propiedad para el position absoulute
        left: 0, //propiedad para el position absoulute
        right: 0, //propiedad para el position absoulute
        bottom: 0, //propiedad para el position absoulute
    },
    header: {
        width: '100%', // hace que el header ocupe el 100% de la pantalla del telefono
        height: 97, // hace que el heaer tenga una altura de 97
        backgroundColor: '#0B5A39', // cambia el color del header
        alignItems: 'center', // centra los items de manera vertical
        justifyContent: 'center', // centra los items de manera horizontal
        borderBottomLeftRadius: 15,  // controla el redondeo del borde inferior izquierdo.
        borderBottomRightRadius: 15, // controla el redondeo del borde inferior derecho.
          shadowColor: '#000', // indica el color de la sombra 
          shadowOffset: { width: 0, height: 7 }, // indica donde va estar la sombra
          shadowOpacity: 0.8, //coloca una opacidad a la sombra
          shadowRadius: 4, // indica lo redondeado de la sombra
          elevation: 5, // indica que tan salido va estar el elemento
    },
      headerText: {
        color: '#E0F9E4', // coloca un color al texto del header
        fontSize: 28, // coloca un tamaño de letra al texto del header
        textTransform: 'uppercase', // hace que el texto del header este siempre en mayusculas
        fontFamily: 'Quicksand',
      },
    inputContainer: {
        alignItems: 'center', // centra los items de manera vertical
        height: 190,
        marginTop: 150,
    },
      input: {
        fontFamily: 'Quicksand_SemiBold',
        width: 274, // hace que los input tengan un ancho del 274
        height: 58, // hace que los input tengan una altura de 58
        borderRadius: 27, // agrega unas esquinas redondeadas
        paddingHorizontal: 20, // coloca un espacio entre el texto y el input, en la parte de arriba y abajo 
        backgroundColor: '#E8FCE9', // coloca un color de fondo para el input
        color: '#01160399', // coloca un color para la letra que escribas
        opacity: 0.95, // coloca una opacidad al input2
      },
      eyeIconContainer1: {
        position: 'absolute', // hace que el elemento pueda moverse libremente por la pantalla, segun las propiedades que se le den
        right: 20,  // valor del position absolute
        top: 10, // valor del position absolute
        justifyContent: 'center', // centra los items de manera horizontal
        alignItems: 'center', // centra los items de manera vertical
      },
      eyeIconContainer2: {
        position: 'absolute', //hace que un elemento pueda moverse libremente segun las propiedades que se le indiquen
        right: 20, //propiedad para el position absoulute
        top: 45, //propiedad para el position absoulute
        justifyContent: 'center', // centra los items de manera horizontal
        alignItems: 'center', // centra los items de manera vertical
      },
    buttonContainer: {
        bottom: 60 //indica en donde va estar el elemento
    },
      button: {
        width: 274, // le pone un ancho de 274 al boton
        height: 58, // le pone una altura de 58 al boton 
        justifyContent: 'center', // centra los items de manera horizontal
        alignItems: 'center', // centra los items de manera vertical
        borderRadius: 27, // agrega un borde redondeado
          shadowColor: '#000', // agrega un color de sombra
          shadowOffset: { width: 0, height: 7 }, // añade la posicion de la sombra
          shadowOpacity: 0.8, // añade una opacidad al boton 
          shadowRadius: 4, // añade un borde redondeado a la sombra
          elevation: 5, // indica que tan salido va estar el elemento
      },    
      buttonText: {
        color: '#fff', // indica el color del texto del boton 
        fontSize: 15, // indica el tamaño de la letra del boton 
        fontFamily: 'Quicksand',
      },
    
    footer: {
      height: 167, // indica que el footer tendra una altura de 167
      backgroundColor: '#0B5A39', // indica el color del footer
      justifyContent: 'center',  // centra los items de manera horizontal
      alignItems: 'center', // centra los items de manera vertical
      marginTop: 20, // indica en donde va estar el elemento
      bottom: 0,  //indica en donde va estar el elemento
      left: 0,    //indica en donde va estar el elemento
      right: 0,  //indica en donde va estar el elemento
      borderTopLeftRadius: 15, // controla el redondeo del borde superior izquierdo.
      borderTopRightRadius: 15, // controla el redondeo del borde superior izquierdo.
        shadowColor: '#000', // indica el color de la sombra
        shadowOffset: { width: 0, height: -7 }, // indica la posicion de la sombra
        shadowOpacity: 0.8, // indica la opacidad de la sombra
        shadowRadius: 12, // indica que tal redondeado va estar la sombra
        elevation: 15, // indica que tan salido va estar el elemento
    },
})