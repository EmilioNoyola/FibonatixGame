import React, { useState } from 'react';  
import { Text, View, SafeAreaView, StatusBar, Pressable, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useCustomFonts from '../../../assets/components/FontsConfigure';
import { MaterialIcons } from '@expo/vector-icons'; 
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FoodShop from './components/FoodShop';
import InventaryList from './components/InventaryList';
import { useAppContext } from '../../../assets/context/AppContext';
import AnimatedBar from '../../../assets/components/AnimatedBar';

export default function FoodRoomScreen(props) {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    const { globalData, refreshUserData } = useAppContext();
    const [refreshing, setRefreshing] = useState(false);
    if (!fontsLoaded) return null;

    const navigation = useNavigation();

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await refreshUserData();
        } catch (error) {
            console.error('Error al recargar datos globales:', error);
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#FFA851"
                        colors={['#FFA851']}
                    />
                }
            >
                <StatusBar
                    barStyle="dark-content"
                    translucent={true}
                    backgroundColor="transparent"
                />

                <View style={styles.header}>
                    <View style={{ marginHorizontal: 10, marginTop: 30 }}>
                        <View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                <Pressable onPress={() => { navigation.openDrawer(); }} style={styles.menuButton}>
                                    <MaterialIcons name="menu" size={30} color="white" />
                                </Pressable>

                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={styles.containerEmotion}>
                                        <View style={styles.Emotion}>
                                            <MaterialCommunityIcons name="food-apple-outline" size={40} color="#6d3709" />
                                        </View>   
                                    </View>
                                    <AnimatedBar
                                        percentage={globalData.foodPercentage || 0}
                                        barStyle={styles.BarEmotion}
                                        containerStyle={styles.containerBarEmotion}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: -5 }}>
                            <Text style={styles.textHeader}>Comedor</Text>
                        </View>
                    </View>
                </View>

                <FoodShop />

                <View style={styles.containerInventary}>
                    <View style={styles.containerButtonAlimentar}>
                        <Pressable style={styles.buttonAlimentar}>
                            <Text style={styles.textButtonAlimentar}>Alimentar</Text>
                        </Pressable>
                    </View>
                    <View style={styles.containerFood}>
                        <InventaryList />
                        <Text style={styles.textFood}>Almacén</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEE6C4',
        justifyContent: 'space-between',   
    },
    header: {
        backgroundColor: '#FFA851',
        height: 164,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    textHeader: {
        fontSize: 48,
        color: 'white',
        fontFamily: 'Quicksand',
        textAlign: 'center',
    },
    menuButton: {
        backgroundColor: 'black',
        borderRadius: 70,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerEmotion: {
        backgroundColor: '#6d3709',
        borderRadius: 80,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        zIndex: 1,
    },
    Emotion: {
        backgroundColor: '#f4d880',
        borderRadius: 60,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        zIndex: 1,
        position: 'absolute',
    },
    containerBarEmotion: {
        backgroundColor: '#6d3709',
        borderTopRightRadius: 60,
        borderBottomRightRadius: 60,
        width: 250,
        height: 35,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: -10,
        overflow: 'hidden',
    },
    BarEmotion: {
        backgroundColor: 'orange',
        borderTopRightRadius: 60,
        borderBottomRightRadius: 60,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -10,
        position: 'relative',
    },
    scrollArea: {
        flex: 1,
        marginTop: 20,
        marginBottom: 40,
    },
    scrollContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    Card: {
        width: 360,
        height: 160,
        backgroundColor: '#E26F02',
        borderRadius: 35,
        marginBottom: 40,
        alignSelf: 'center',
        flexDirection: 'row',
        padding: 10,
    },
    containerImage: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EC8926',
        width: 196,
        height: 138,
        borderRadius: 30,
        marginRight: 20,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    textButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    cardText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Quicksand',
        textAlign: 'center',
    },
    containerButton: {
        width: 80,
        height: 55,
        marginTop: 10,
        padding: 10,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    containerShop: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
    },
    textOption: {
        marginBottom: 10,
        fontSize: 24,
        fontFamily: 'Quicksand',
        color: 'black',
        textAlign: 'center',
    },
    Option: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerCircleFood: {
        width: 200,
        height: 200,
        borderRadius: 10000,
        backgroundColor: '#E97B36',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageFood: {
        width: 220,
        height: 220,
        resizeMode: 'contain',
        borderRadius: 110,
    },
    containerInfo: {
        marginTop: '3%',
        width: '90%',
        height: '20%',
        backgroundColor: '#E97B36',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        width: '95%',
        height: '80%',
        backgroundColor: '#FFD3B8',
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    precio: {
        width: '30%',
        height: '50%',
        backgroundColor: '#D78B49',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    coin: {
        width: 40,
        height: 40,
        backgroundColor: 'orange',
        borderRadius: 20,
    },
    textPrecio: {
        color: 'black',
        fontSize: 15,
        fontFamily: 'Quicksand_Medium',
        marginLeft: 7,
    },
    cantidad: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 18,
    },
    textCantidad: {
        color: 'black',
        fontSize: 25,
        fontFamily: 'Quicksand',
        marginHorizontal: 10,
    },
    buttonComprar: {
        width: '30%',
        height: '50%',
        backgroundColor: '#6d3709',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textComprar: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Quicksand_Medium',
    },
    containerInventary: {
        width: '100%',
        height: '25%',
        backgroundColor: '#EBD2B2',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    containerButtonAlimentar: {
        height: '28%'
    },
    buttonAlimentar: {
        top: '-50%',
        width: '50%',
        height: '100%',
        backgroundColor: '#C16718',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 0,
        elevation: 4,
    },
    textButtonAlimentar: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'Quicksand',
    },
    containerFood: {
        flex: 1,
        alignItems: 'center',
    },      
    containerItems: {
        width: '90%',
        height: '55%',
        backgroundColor: '#FF973D',
        borderRadius: 20,
    },
    containerPrecio: {
        backgroundColor: 'black',
        display: 'flex',   
        bottom: -10,
        position: 'absolute',
        width: 50,
        height: 50,
        bottom: 0,
    },
    textFood: {
        marginTop: 10,
        color: 'black',
        fontSize: 24,
        fontFamily: 'Quicksand',
        textAlign: 'center',
    }
});