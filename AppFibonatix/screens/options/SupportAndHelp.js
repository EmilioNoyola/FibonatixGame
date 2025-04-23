// Componentes de React
import React from 'react';  
import { Text, View, SafeAreaView, StatusBar, Pressable, StyleSheet, Image } from 'react-native';
import { useState, useEffect } from 'react';

// Navegación
import { useNavigation } from '@react-navigation/native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Collapsible from 'react-native-collapsible';

// Fuentes
import useCustomFonts from '../../assets/apis/FontsConfigure';

// Íconos
import Ionicons from '@expo/vector-icons/Ionicons';

// Alertas Personalizadas
import CustomAlert from '../../assets/apis/Alertas';

const groupedSections = [
    {
        category: "Acerca de",
        items: [
            { id: 1, question: "¿Quiénes somos?", answer: "Somos un equipo de estudiantes del Centro de Estudios Científicos y Tecnológicos 9 'Juan de Dios Bátiz' que desarrollamos soluciones tecnológicas innovadoras enfocadas en el aprendizaje interactivo. Nuestro objetivo es mejorar la experiencia educativa de niños en sus primeros años escolares, combinando aprendizaje lúdico y tecnología." },
            { id: 2, question: "¿Qué hacemos?", answer: "Diseñamos herramientas educativas interactivas que integran lo físico y lo digital. Nuestro principal proyecto es un peluche interactivo vinculado a una aplicación móvil, que fomenta el aprendizaje de matemáticas básicas en niños de preescolar y primaria mediante juegos educativos adaptativos. Además, promovemos el desarrollo socioemocional de los niños, ofreciendo una experiencia completa y segura para el aprendizaje." },
        ],
    },
    {
        category: "General",
        items: [
            { id: 3, question: "¿Cómo funciona?", answer: "La aplicación móvil sirve como la base del sistema educativo. Se conecta con el peluche interactivo a través de Bluetooth, permitiendo que el peluche cobre vida e interactúe con los niños. Ofrece actividades y juegos personalizados para enseñar conceptos matemáticos básicos de manera divertida, adaptándose al ritmo de aprendizaje del niño. Además, incluye un sistema de control parental para que los padres supervisen el progreso y aseguren la idoneidad de los contenidos." },
            { id: 4, question: "¿Por qué lo hacemos?", answer: "Detectamos que muchos métodos educativos tradicionales no captan el interés de los niños pequeños, especialmente en áreas como matemáticas. Nuestro proyecto busca resolver esta problemática ofreciendo una alternativa educativa innovadora y accesible que combine juego, aprendizaje y tecnología. Así, ayudamos a los niños a desarrollar habilidades esenciales mientras se divierten." },
        ],
    },
    {
        category: "Jugabilidad",
        items: [
            { id: 5, question: "¿Cómo jugar?", answer: "Conexión: Los niños colocan un dispositivo móvil en el compartimiento del peluche e inician la aplicación móvil. Interacción: Seleccionan un juego o actividad dentro de la aplicación. A medida que interactúan con el peluche y la app, resuelven ejercicios matemáticos y reciben retroalimentación. Aprendizaje: Los desafíos y actividades se ajustan al nivel del niño, ofreciendo una experiencia personalizada." },
            { id: 6, question: "¿Donde veo el progreso?", answer: "El progreso de los niños se almacena de manera local y puede consultarse en nuestra pagina web a través del sistema de control parental. Este sistema permite a los padres revisar las actividades realizadas, los niveles completados y las áreas en las que sus hijos destacan o necesitan mejorar." },
        ],
    },
];

export default function SupportAndHelp(props) {

    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    if (!fontsLoaded) return null;

    const navigation = useNavigation();

    // Estado para controlar qué preguntas están expandidas
    const [expandedSections, setExpandedSections] = useState([]);
    const toggleSection = (id) => {
        setExpandedSections((prev) =>
            prev.includes(id) ? prev.filter((sectionId) => sectionId !== id) : [...prev, id]
        );
    };

    // Estados para controlar la visibilidad de las alertas
    const [alerts, setAlerts] = useState({ type: null, visible: false });
    const showAlert = (type) => setAlerts({ type, visible: true });
    const hideAlert = () => setAlerts({ ...alerts, visible: false });

    // Confirmar la alerta.
    const handleConfirmAlert = async () => {
        switch (alerts.type) {
            case "resetProgress": await handleResetProgress(); hideAlert(); break;
            case "progressReset": hideAlert(); break;
            default: hideAlert(); break;
        }
    }; 

    // Titulo de las alertas
    const mostrarTituloAlerta = (type) => {
        switch (type) {
        case "resetProgress": return "Reiniciar Progreso";
        case "progressReset": return "Progreso Reiniciado";
        default: return "Alerta";
        }
    };
    
    // Mensajes de las alertas.
    const mostrarMensajeAlerta = (type) => {
        switch (type) {
        case "resetProgress": return "¿Estás seguro de que deseas reiniciar todo tu progreso? Esto no se puede deshacer.";
        case "progressReset": return "Todo tu progreso ha sido reiniciado.";
        default: return "";
        }
    };
    
    // Texto del botón confirmar.
    const textoConfirmar = (type) => {
        switch (type) {
        case "resetProgress": return "Sí, Reiniciar";
        case "progressReset": return "Aceptar";
        default: return "Aceptar";
        }
    };
    
    // Texto del botón cancelar.
    const textoCancelar = (type) => {
        switch (type) { 
        case "resetProgress": return "Cancelar";
        default: return null;
        }
    };  

    return (
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>

            <StatusBar
                barStyle="dark-content"
                translucent={true}
                backgroundColor="transparent"
            />

            <View style={styles.header}>
                <View style={styles.containerButtonBack}>
                    <Pressable onPress={() => props.navigation.goBack()} style={styles.ButtonBack}>
                        <Ionicons name="chevron-back" size={35} color="#1B5B44" />
                    </Pressable>
                </View>
                <View style={styles.containerTextHeader}>
                    <Text style={styles.textHeader}>Soporte y Ayuda</Text>
                </View>
            </View>

            <View style={styles.content}>
                <ScrollView
                    contentContainerStyle={{
                        padding: 20, 
                    }}
                    style={styles.scrollView} 
                >
                    {groupedSections.map((section, index) => (
                        <View key={index} style={styles.sectionContainer}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>{section.category}</Text>
                            </View>

                            {section.items.map((item) => (
                                <View key={item.id} style={styles.section}>
                                    <Pressable
                                        onPress={() => toggleSection(item.id)}
                                        style={styles.questionContainer}
                                    >
                                        <Text style={styles.question}>{item.question}</Text>
                                        <Ionicons
                                            name={expandedSections.includes(item.id) ? 'chevron-up-outline' : 'chevron-down-outline'}
                                            size={24}
                                            color="#40916C"
                                        />
                                    </Pressable>
                                    <Collapsible collapsed={!expandedSections.includes(item.id)}>
                                        <View style={styles.answerContainer}>
                                            <Text style={styles.answer}>{item.answer}</Text>
                                        </View>
                                    </Collapsible>
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <View style={styles.circle}>
                    <Image source={require('../../assets/img/LogoFibonatix.png')} style={styles.image} />
                </View>
                <Text style={styles.textFooter}>Frognova</Text>
            </View>

            {alerts.visible && (
                <CustomAlert
                    showAlert={alerts.visible}
                    title={mostrarTituloAlerta(alerts.type)}
                    message={mostrarMensajeAlerta(alerts.type)}
                    onConfirm={handleConfirmAlert}
                    onCancel={alerts.type === "resetProgress" ? hideAlert : null}
                    confirmText={textoConfirmar(alerts.type)}
                    cancelText={textoCancelar(alerts.type)}
                    confirmButtonColor="#40916C"
                />
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D8F3DC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#74C69D',
        height: 120,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    containerButtonBack: {
        left: 20,
    },
    ButtonBack: {
        backgroundColor: '#D8F3DC',
        borderRadius: 70,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerTextHeader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textHeader: {
        fontSize: 35,
        color: 'white',
        fontFamily: 'Quicksand',
        textAlign: 'center',
    },
    content: {
        flex: 1, // Ocupa el espacio restante entre el header y el footer
        alignItems: 'center', // Centra el ScrollView horizontalmente
    },
    scrollView: {
        width: '100%', // Ajusta el ancho del ScrollView
        borderRadius: 10, // Opcional: estilo adicional
        marginBottom: 50,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    titleContainer: {
        marginBottom: 10,
        backgroundColor: '#40916C',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        color: 'white',
        fontFamily: 'Quicksand',
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#c8eece',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
    },
    question: {
        fontSize: 18,
        color: '#1B5B44',
        fontFamily: 'Quicksand_SemiBold',
    },
    answerContainer: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
    },
    answer: {
        fontSize: 15,
        color: '#666',
        fontFamily: 'Quicksand_Regular',
    },
    footer: {
        height: 120,
        backgroundColor: '#74C69D',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#D8F3DC',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -50,
    },
    image: {
        width: 85,
        height: 85,
    },
    textFooter: {
        fontSize: 30,
        color: 'white',
        fontFamily: 'Quicksand',
        marginTop: 10,
    },
});
