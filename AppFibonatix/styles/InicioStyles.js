import { StyleSheet } from "react-native";

export const InicioStyles = StyleSheet.create({

    main: {
        flex: 1, 
        backgroundColor: '#0B5A39',
    },

    container: {

        flex: 1,
        backgroundColor: '#0B5A39',

    }, 
    
    principal: {
        
        alignItems: 'center',  
        justifyContent: 'center',  
        paddingVertical: 50,

    },
    
    principalText1: {
        color: '#9DE1B3',
        fontSize: 32, 
        marginVertical: 10,  
        width: 268,
        textAlign: 'center',
        fontFamily: 'Quicksand',
    },  
    
    principalText2: {
        color: '#0B5A39',
        fontSize: 24, 
        marginVertical: 10,  
        width: 268,
        textAlign: 'center',
        fontFamily: 'Quicksand',
        zIndex: 10,
    },  

    principalImage: {

        width: 332,
        height: 293,
        zIndex: 10,

    },

    buttonContainer: {

        width: 320,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        zIndex: 10,
        borderRadius: 27,
            borderRadius: 37,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 7 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            elevation: 5,

    },

    buttonText: {

        color: '#fff',
        fontSize: 37,
        textTransform: 'uppercase',
        fontFamily: 'Quicksand',

    },

    footer: {

        height: 400, 
        backgroundColor: '#9DE1B3', 
        justifyContent: 'center', 
        alignItems: 'center', 
        position: 'absolute',
        borderRadius: 15,  
        bottom: 0, 
        left: 0,   
        right: 0,
        zIndex: 0,

    },

})