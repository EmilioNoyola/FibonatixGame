import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const LoginStyles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#B1F6C3',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(177, 246, 195, 0.5)',
    },
    cardContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 30,
        padding: 20,
        height: width * 1.2, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    headerText: {
        fontSize: 30,
        fontFamily: 'Quicksand',
        textAlign: 'center',
        color: '#0B5A39',
        marginBottom: 5,
    },
    subHeaderText: {
        fontSize: 16,
        fontFamily: 'Quicksand_SemiBold',
        textAlign: 'center',
        color: '#0B5A39',
        marginBottom: 30, 
    },
    inputContainer: {
        gap: 15,
        marginBottom: 40, 
    },
    inputWrapper: {
        position: 'relative',
        width: '100%',
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E8FCE9',
        justifyContent: 'center',
    },
    input: {
        fontFamily: 'Quicksand_SemiBold',
        width: '100%',
        height: '100%',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingRight: 50,
        color: '#011603',
        fontSize: 16,
    },
    eyeIconContainer: {
        position: 'absolute',
        right: 15,
        top: '50%',
        transform: [{ translateY: -12 }],
    },
    buttonContainer: {
        marginBottom: 10, 
        alignItems: 'center',
    },
    button: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Quicksand',
    },
    recoverPasswordContainer: {
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    recoverPasswordText: {
        color: '#0B5A39',
        fontSize: 14,
        textAlign: 'right',
    },
    registerText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#0B5A39',
        marginTop: 10,
    },
    registerLink: {
        fontWeight: 'bold',
        color: '#239790',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    loadingText: {
        color: '#FFF',
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'Quicksand',
    },
});