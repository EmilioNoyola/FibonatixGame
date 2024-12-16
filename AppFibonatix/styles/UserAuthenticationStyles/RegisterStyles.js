import { StyleSheet } from "react-native";

export const RegisterStyles = StyleSheet.create({

    main: {

      flex: 1, 
      backgroundColor: '#B1F6C3',

    },

    container: {

      flex: 1,
      backgroundColor: '#B1F6C3',

    },
    
    backgroundImage: {

      resizeMode: 'contain',
      position: 'absolute',
      opacity: 0.7,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

    },
    
    header: {
      
      width: '100%',
      height: 97,
      backgroundColor: '#0B5A39',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,

    },

      headerText: {

        color: '#E0F9E4',
        fontSize: 40,
        textTransform: 'uppercase',
        fontFamily: 'Quicksand',

      },

    inputContainer: {

      alignItems: 'center',
      height: 350,
      marginTop: 70,

    },
    
      input: {

        fontFamily: 'Quicksand_SemiBold',
        width: 274,
        height: 58,
        borderRadius: 27,
        paddingHorizontal: 20,
        backgroundColor: '#E8FCE9',
        color: '#01160399',
        opacity: 0.95,
        marginBottom: 35,

      },


    eyeIconContainer: {

      position: 'absolute',
      right: 20,
      top: 10, 
      height: 38,
      width: 38,
      justifyContent: 'center',
      alignItems: 'center',

    },
    

    buttonContainer: {

        bottom: 60

    },
    
      button: {

        width: 274,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 27,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 7 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
          elevation: 5,

      },    

      buttonText: {

        color: '#fff',
        fontSize: 15,
        fontFamily: 'Quicksand',

      },
    
    footer: {

        height: 167, 
        backgroundColor: '#0B5A39',
        justifyContent: 'center', 
        alignItems: 'center',    
        marginTop: 20, 
        bottom: 0,  
        left: 0,   
        right: 0,   
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -7 },
          shadowOpacity: 0.8,
          shadowRadius: 12,
          elevation: 15,

    },
    
      footerText: {

        color: '#9DE0B6',
        fontSize: 14,
        justifyContent: 'center',
        alignItems: 'center',   
        bottom: 20,
        fontFamily: 'Quicksand_Medium',

      },

      loadingContainer: {
        position: 'absolute', // Hace que el contenedor se superponga al resto del contenido
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semitransparente
        justifyContent: 'center', // Centra el contenido verticalmente
        alignItems: 'center', // Centra el contenido horizontalmente
        zIndex: 10, // Hace que el contenedor esté por encima de otros elementos
      },
          loadingText: {
            color: '#fff',
            fontSize: 18,
            marginTop: 10,
            textAlign: 'center',
          },

})