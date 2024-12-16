import { StyleSheet } from "react-native";

export const recoverPasswordStyles = StyleSheet.create({

    main: {

      flex: 1, // para que el contenido abarque toda la pantalla
      backgroundColor: '#B1F6C3', //cambia el color del fondo principal 

    },

    container: {

      flex: 1, // para que el contenido abarque toda la pantalla
      backgroundColor: '#B1F6C3', // cambia el color del contenedor

    },
      
    backgroundImage: {

      resizeMode: 'contain', // cambia el tamaño de la imagen para que abarque toda la pantalla
      position: 'absolute', // hace que el elemento pueda moverse libremente por la pantalla segun las porpiedades
      opacity: 0.7, // cambia la opacidad del fondo
      top: 0, //propiedad para el position absoulute
      left: 0, //propiedad para el position absoulute
      right: 0, //propiedad para el position absoulute
      bottom: 0, //propiedad para el position absoulute

    },
    
    header: {

      width: '100%', // hace que el ancho del header sea de toda la pantalla
      height: 97, // pone una altura de 97 al header
      backgroundColor: '#0B5A39', // coloca un color al header
      alignItems: 'center', // centra los items de manera vertical
      justifyContent: 'center', // centra los items de manera horizontal
      borderBottomLeftRadius: 15, // controla el redondeo del borde inferior izquierdo.
      borderBottomRightRadius: 15, // controla el redondeo del borde inferior derecho.
        shadowColor: '#000', // coloca un color a la sombra
        shadowOffset: { width: 0, height: 7 }, // coloca la posicion de la sombra
        shadowOpacity: 0.8, // le pone una opacidad a la sombra
        shadowRadius: 4, // le pone un redondeado para la sombra
        elevation: 5, // indica que tan salido va estar el elemento

    },

      headerText: {

        color: '#E0F9E4', // inidca que color tiene el header
        fontSize: 28, // indica el tamaño de la letra
        textTransform: 'uppercase', // indica que la letra siempre sera mayuscula
        fontFamily: 'Quicksand',

      },

    inputContainer: {

      alignItems: 'center', // centra los items de manera vertical
      height: 150,
      marginTop: 150,

    },
    
      input: {

        width: 274, // indica que el input tendra un ancho de 272
        height: 58, // indica que el input tendra una altura de 58
        borderRadius: 27, // indica que el input tendra un redondeado en las esquinas
        paddingHorizontal: 20, // indica la separacion que va tener el texto
        backgroundColor: '#E8FCE9', // indica el color del fondo del input
        color: '#01160399', // indica el color de la letra del input
        fontFamily: 'Quicksand_SemiBold',
        opacity: 0.95, // indica la opacidad del input

      },

      eyeIconContainer: {
        
        position: 'absolute', // indica que el elemento se va a poser mover libremente
        right: 10,  //propiedad para el position absoulute
        top: 5, //propiedad para el position absoulute
        height: 45, //propiedad para el position absoulute
        width: 45, //propiedad para el position absoulute
        justifyContent: 'center', // centra los items de manera horizontal
        alignItems: 'center', // centra los items de manera vertical

      },
    
    buttonContainer: {

      bottom: 60 //propiedad para el position 

    },
    
      button: {

        width: 154, // indica que el boton tendra un ancho de 154
        height: 58, // indica que el boton tendra una altura de 58
        justifyContent: 'center',// centra los items de manera horizontal
        alignItems: 'center', // centra los items de manera vertical
        borderRadius: 27, //indica el redondeado del borde
        marginTop: 20, // indica el margen en la parte superior
          shadowColor: '#000', // indica el color de la sombra
          shadowOffset: { width: 0, height: 7 }, // indica la posicion de la sombra
          shadowOpacity: 0.8, // indica la opacidad de la sombra
          shadowRadius: 4, // le pone un redondeado para la sombra
          elevation: 5, // indica que tan salido va estar el elemento
 
      },    

      buttonText: {

        color: '#fff', // indica que el texto tenddra un color blanco
        fontSize: 15, // indica el tamaño de la fuente
        fontFamily: 'Quicksand',

      },
    
      footer: {

        marginTop: 20, // indica el margen en la parte superior
        bottom: 0, //propiedad para el position absoulute
        left: 0,    //propiedad para el position absoulute
        right: 0, //propiedad para el position absoulute
        height: 167, //propiedad para el position absoulute
        backgroundColor: '#0B5A39', // indica el color del fondo del footer
        justifyContent: 'center', // centra los items de manera horizontal
        alignItems: 'center',     // centra los items de manera vertical
        borderTopLeftRadius: 15, // controla el redondeo del borde superior izquierdo.
        borderTopRightRadius: 15, // controla el redondeo del borde superior derecho.
          shadowColor: '#000', // indica el color de la sombra
          shadowOffset: { width: 0, height: -7 }, // indica la posicion de la sombra
          shadowOpacity: 0.8, // indica la opacidad de la sombra
          shadowRadius: 12, // le pone un redondeado para la sombra
          elevation: 15, // indica que tan salido va estar el elemento

      },

        InputButton: {
          
          fontFamily: 'Quicksand_SemiBold',
          width: 274, // indic que el input tendra un ancho de 274
          height: 58, // indica que el input tendra una altura de 58
          paddingHorizontal: 20, // indica que habra una separacion entre el texto de 20
          backgroundColor: '#239790', // indica el color de fondo del input
          justifyContent: 'center',// centra los items de manera horizontal
          alignItems: 'center', // centra los items de manera vertical
          borderRadius: 27, //  indica el borde redondeado 
            shadowColor: '#000', // indica el color de la sombra
            shadowOffset: { width: 0, height: 7 }, // indica la posicion de la sombra
            shadowOpacity: 0.8, // indica la opacidad de la sombra
            shadowRadius: 4, // le pone un redondeado para la sombra
            elevation: 5, // indica que tan salido va estar el elemento
 
        },

})