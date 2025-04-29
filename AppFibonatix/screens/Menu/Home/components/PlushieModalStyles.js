import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: '60%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0B5A39',
    },
    closeButton: {
        padding: 5,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    testButton: {
        backgroundColor: '#0B5A39',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deviceListContainer: {
        marginBottom: 20,
        maxHeight: 150,
    },
    deviceListTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0B5A39',
        marginBottom: 10,
    },
    deviceList: {
        maxHeight: 120,
    },
    deviceItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    deviceText: {
        fontSize: 16,
        color: '#333',
    },
    noDevicesText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});