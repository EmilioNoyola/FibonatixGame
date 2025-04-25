import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    SafeAreaView,
    ActivityIndicator,
    StatusBar
} from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import axios from 'axios';
import { useAppContext } from '../../assets/context/AppContext';
import CustomAlert from '../../assets/components/CustomAlert';
import { Ionicons } from '@expo/vector-icons'; 

const API_BASE_URL = 'http://192.168.56.1:3000'; 
const db = getFirestore();
const auth = getAuth();

const AdminScreen = () => {
    const { user } = useAppContext();
    const [usersWithCodes, setUsersWithCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState({ type: null, visible: false });
    const [refreshing, setRefreshing] = useState(false);

    const showAlert = (type) => setAlerts({ type, visible: true });
    const hideAlert = () => setAlerts({ ...alerts, visible: false });

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch users
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const usersList = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Fetch activation codes
            const codesSnapshot = await getDocs(collection(db, 'activationCodes'));
            const codesList = codesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Combine users with their activation codes
            const combinedList = usersList.map(user => {
                const associatedCode = codesList.find(code => code.usedBy === user.id);
                return {
                    ...user,
                    activationCode: associatedCode || null,
                };
            });

            setUsersWithCodes(combinedList);
        } catch (error) {
            console.error('Error fetching data:', error);
            showAlert('dataFetchError');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const getClientIdFromFirebaseId = async (firebaseId) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/getClientId`, {
                client_fire_base_ID: firebaseId,
            });
            return response.data.client_ID;
        } catch (error) {
            console.error('Error fetching client_ID:', error);
            throw new Error('No se pudo obtener el client_ID para este usuario.');
        }
    };

    const deleteUserAndCode = async (firebaseId) => {
        try {
            // Obtener el client_ID desde el firebaseId
            const clientId = await getClientIdFromFirebaseId(firebaseId);

            // Realizar la solicitud de eliminación
            await axios.delete(`${API_BASE_URL}/api/deleteclient`, {
                data: { 
                    client_ID: firebaseId, // Enviar el firebaseId directamente, ya que deleteClient usa el ID de Firebase
                    current_admin_id: user.uid, 
                },
            });

            // Actualizar el estado local
            setUsersWithCodes(usersWithCodes.filter(item => item.id !== firebaseId));
            showAlert('deleteSuccess');
        } catch (error) {
            console.error('Error deleting user and code:', error);
            const errorMessage = error.response?.data?.error || 'No se pudo eliminar el usuario.';
            
            if (errorMessage.includes('No puedes eliminarte a ti mismo')) {
                showAlert('selfDeleteError');
            } else if (errorMessage.includes('No puedes eliminar a otro administrador')) {
                showAlert('adminDeleteError');
            } else {
                showAlert('deleteError');
            }
        }
    };

    const confirmDelete = (userId, email) => {
        showAlert('confirmDelete');
        setAlerts(prev => ({ ...prev, userId, email }));
    };

    const handleDeleteConfirm = () => {
        if (alerts.userId) {
            deleteUserAndCode(alerts.userId);
        }
        hideAlert();
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setTimeout(() => {
                showAlert('logoutSuccess');
            }, 500);
        } catch (error) {
            console.error('Error logging out:', error);
            showAlert('logoutError');
        }
    };

    const getUserRoleBadge = (userRole) => {
        if (userRole === 'admin') {
            return <View style={[styles.badge, styles.adminBadge]}><Text style={styles.badgeText}>Admin</Text></View>;
        } else {
            return <View style={[styles.badge, styles.userBadge]}><Text style={styles.badgeText}>Usuario</Text></View>;
        }
    };

    const getLicenseBadge = (license) => {
        let badgeStyle = styles.freeBadge;
        
        if (license === 'premium') {
            badgeStyle = styles.premiumBadge;
        } else if (license === 'pro') {
            badgeStyle = styles.proBadge;
        }
        
        return (
            <View style={[styles.badge, badgeStyle]}>
                <Text style={styles.badgeText}>{license}</Text>
            </View>
        );
    };

    const renderUserItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.userInfoHeader}>
                    <Text style={styles.userName}>{item.username}</Text>
                    {getUserRoleBadge(item.role)}
                    {getLicenseBadge(item.license)}
                </View>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => confirmDelete(item.id, item.email)}
                >
                    <Ionicons name="trash-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.cardDivider} />
            
            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={18} color="#666" />
                    <Text style={styles.infoText}>{item.email}</Text>
                </View>
                
                <View style={styles.infoRow}>
                    <Ionicons name="key-outline" size={18} color="#666" />
                    <Text style={styles.infoText}>
                        {item.activationCode 
                            ? item.activationCode.code 
                            : 'No asignado'}
                    </Text>
                </View>
                
                {item.activationCode && (
                    <>
                        <View style={styles.infoRow}>
                            <Ionicons name="checkmark-circle-outline" size={18} color={item.activationCode.used ? "#22c55e" : "#666"} />
                            <Text style={styles.infoText}>
                                Estado: {item.activationCode.used ? 'Activado' : 'No activado'}
                            </Text>
                        </View>
                        
                        {item.activationCode.used && item.activationCode.redeemedAt && (
                            <View style={styles.infoRow}>
                                <Ionicons name="calendar-outline" size={18} color="#666" />
                                <Text style={styles.infoText}>
                                    Activado el: {new Date(item.activationCode.redeemedAt).toLocaleString()}
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </View>
        </View>
    );

    const getAlertTitle = (type) => {
        switch (type) {
            case 'dataFetchError': return 'Error de Carga';
            case 'deleteSuccess': return 'Eliminación Exitosa';
            case 'selfDeleteError': return 'Acción No Permitida';
            case 'adminDeleteError': return 'Acción No Permitida';
            case 'deleteError': return 'Error de Eliminación';
            case 'confirmDelete': return 'Confirmar Eliminación';
            case 'logoutSuccess': return 'Cierre de Sesión Exitoso';
            case 'logoutError': return 'Error al Cerrar Sesión';
            default: return 'Alerta';
        }
    };

    const getAlertMessage = (type, email) => {
        switch (type) {
            case 'dataFetchError': return 'No se pudieron cargar los datos.';
            case 'deleteSuccess': return 'Usuario y código de activación eliminados correctamente.';
            case 'selfDeleteError': return 'No puedes eliminarte a ti mismo.';
            case 'adminDeleteError': return 'No puedes eliminar a otro administrador.';
            case 'deleteError': return 'No se pudo eliminar el usuario.';
            case 'confirmDelete': return `¿Estás seguro de que deseas eliminar al usuario ${email} y su código de activación?`;
            case 'logoutSuccess': return 'Has cerrado sesión correctamente.';
            case 'logoutError': return 'No se pudo cerrar sesión.';
            default: return '';
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#239790" barStyle="light-content" />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Panel de Administración</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.container}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Usuarios y Códigos</Text>
                    <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
                        <Ionicons name="refresh-outline" size={22} color="#239790" />
                    </TouchableOpacity>
                </View>
                
                {loading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#239790" />
                        <Text style={styles.loadingText}>Cargando usuarios...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={usersWithCodes}
                        renderItem={renderUserItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="people-outline" size={60} color="#ccc" />
                                <Text style={styles.emptyText}>No hay usuarios registrados</Text>
                            </View>
                        }
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                )}
            </View>

            {alerts.visible && (
                <CustomAlert
                    showAlert={alerts.visible}
                    title={getAlertTitle(alerts.type)}
                    message={getAlertMessage(alerts.type, alerts.email)}
                    onConfirm={alerts.type === 'confirmDelete' ? handleDeleteConfirm : hideAlert}
                    confirmButtonColor={alerts.type === 'confirmDelete' ? '#ff4444' : '#0B5A39'}
                    confirmText={alerts.type === 'confirmDelete' ? 'Eliminar' : 'Aceptar'}
                    onCancel={alerts.type === 'confirmDelete' ? hideAlert : null}
                    cancelButtonColor={alerts.type === 'confirmDelete' ? '#239790' : null}
                    cancelText={alerts.type === 'confirmDelete' ? 'Cancelar' : null}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#239790',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#239790',
        paddingVertical: 16,
        paddingHorizontal: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    logoutButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    refreshButton: {
        padding: 5,
    },
    list: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#f9f9f9',
    },
    userInfoHeader: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
        color: '#333',
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#eee',
    },
    cardBody: {
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 15,
        marginLeft: 10,
        color: '#444',
        flex: 1,
    },
    deleteButton: {
        backgroundColor: '#ff4444',
        padding: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 4,
    },
    adminBadge: {
        backgroundColor: '#7c3aed',
    },
    userBadge: {
        backgroundColor: '#4b5563',
    },
    premiumBadge: {
        backgroundColor: '#f59e0b',
    },
    proBadge: {
        backgroundColor: '#0ea5e9',
    },
    freeBadge: {
        backgroundColor: '#6b7280',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default AdminScreen;