// DashboardParentalControl.js
import React from 'react';  
import { Text, View, SafeAreaView, StatusBar, StyleSheet, Pressable, Dimensions, Image } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import useCustomFonts from '../../assets/components/FontsConfigure';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default function DashboardParentalControl(props) {
    const { fontsLoaded, onLayoutRootView } = useCustomFonts();
    if (!fontsLoaded) return null;

    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('overview');

    // Datos de ejemplo - aquí se conectaría el backend
    const dashboardData = {
        child: {
            name: "Ana María",
            age: 8,
            avatar: "👧",
            level: "Principiante"
        },
        stats: {
            totalTimeToday: "45 min",
            totalTimeWeek: "3h 20min",
            gamesCompleted: 12,
            currentStreak: 5
        },
        progress: {
            math: 75,
            reading: 60,
            science: 45,
            creativity: 80
        },
        recentActivities: [
            { game: "Suma Divertida", time: "15 min", score: 85, date: "Hoy" },
            { game: "Lectura Mágica", time: "20 min", score: 92, date: "Hoy" },
            { game: "Ciencia Espacial", time: "10 min", score: 78, date: "Ayer" }
        ]
    };

    const renderStatsCard = (title, value, icon, color) => (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            <View style={styles.statHeader}>
                <Ionicons name={icon} size={24} color={color} />
                <Text style={styles.statTitle}>{title}</Text>
            </View>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
        </View>
    );

    const renderProgressBar = (subject, percentage, color) => (
        <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
                <Text style={styles.progressSubject}>{subject}</Text>
                <Text style={styles.progressPercentage}>{percentage}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: color }]} />
            </View>
        </View>
    );

    const renderActivityItem = (activity, index) => (
        <View key={index} style={styles.activityItem}>
            <View style={styles.activityLeft}>
                <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.score) }]}>
                    <Ionicons name="game-controller" size={20} color="white" />
                </View>
                <View style={styles.activityInfo}>
                    <Text style={styles.activityGame}>{activity.game}</Text>
                    <Text style={styles.activityTime}>{activity.time} • {activity.date}</Text>
                </View>
            </View>
            <View style={styles.activityScore}>
                <Text style={[styles.scoreText, { color: getActivityColor(activity.score) }]}>
                    {activity.score}
                </Text>
            </View>
        </View>
    );

    const getActivityColor = (score) => {
        if (score >= 90) return '#40916C';
        if (score >= 70) return '#F77F00';
        return '#D62828';
    };

    const renderTabContent = () => {
        switch (selectedTab) {
            case 'overview':
                return (
                    <View style={styles.tabContent}>
                        {/* Stats Cards */}
                        <View style={styles.statsContainer}>
                            {renderStatsCard("Hoy", dashboardData.stats.totalTimeToday, "time", "#40916C")}
                            {renderStatsCard("Esta Semana", dashboardData.stats.totalTimeWeek, "calendar", "#F77F00")}
                        </View>
                        <View style={styles.statsContainer}>
                            {renderStatsCard("Juegos Completados", dashboardData.stats.gamesCompleted.toString(), "trophy", "#9B59B6")}
                            {renderStatsCard("Racha Actual", `${dashboardData.stats.currentStreak} días`, "flame", "#E74C3C")}
                        </View>

                        {/* Progress Section */}
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Progreso por Materia</Text>
                            <View style={styles.progressContainer}>
                                {renderProgressBar("Matemáticas", dashboardData.progress.math, "#40916C")}
                                {renderProgressBar("Lectura", dashboardData.progress.reading, "#F77F00")}
                                {renderProgressBar("Ciencias", dashboardData.progress.science, "#9B59B6")}
                                {renderProgressBar("Creatividad", dashboardData.progress.creativity, "#E74C3C")}
                            </View>
                        </View>
                    </View>
                );
            case 'activities':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Actividades Recientes</Text>
                            <View style={styles.activitiesContainer}>
                                {dashboardData.recentActivities.map((activity, index) => 
                                    renderActivityItem(activity, index)
                                )}
                            </View>
                        </View>
                    </View>
                );
            case 'settings':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Configuración</Text>
                            <View style={styles.settingsContainer}>
                                <Pressable style={styles.settingItem}>
                                    <Ionicons name="time" size={24} color="#40916C" />
                                    <Text style={styles.settingText}>Tiempo de Juego</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#74C69D" />
                                </Pressable>
                                <Pressable style={styles.settingItem}>
                                    <Ionicons name="notifications" size={24} color="#40916C" />
                                    <Text style={styles.settingText}>Notificaciones</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#74C69D" />
                                </Pressable>
                                <Pressable style={styles.settingItem}>
                                    <Ionicons name="shield" size={24} color="#40916C" />
                                    <Text style={styles.settingText}>Seguridad</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#74C69D" />
                                </Pressable>
                                <Pressable style={styles.settingItem}>
                                    <Ionicons name="help-circle" size={24} color="#40916C" />
                                    <Text style={styles.settingText}>Ayuda</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#74C69D" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
            <StatusBar
                barStyle="dark-content"
                translucent={true}
                backgroundColor="transparent"
            />
            
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.containerButtonBack}>
                    <Pressable onPress={() => props.navigation.goBack()} style={styles.ButtonBack}>
                        <Ionicons name="chevron-back" size={35} color="#1B5B44" />
                    </Pressable>
                </View>
                <View style={styles.containerTextHeader}>
                    <Text style={styles.textHeader}>Dashboard</Text>
                </View>
                <View style={styles.headerRight}>
                    <Pressable style={styles.headerButton}>
                        <Ionicons name="settings" size={24} color="#1B5B44" />
                    </Pressable>
                </View>
            </View>

            {/* Child Profile */}
            <View style={styles.profileContainer}>
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatar}>{dashboardData.child.avatar}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.childName}>{dashboardData.child.name}</Text>
                        <Text style={styles.childDetails}>{dashboardData.child.age} años • {dashboardData.child.level}</Text>
                    </View>
                    <View style={styles.levelBadge}>
                        <Ionicons name="star" size={16} color="#F77F00" />
                        <Text style={styles.levelText}>Nivel 3</Text>
                    </View>
                </View>
            </View>

            {/* Navigation Tabs */}
            <View style={styles.tabsContainer}>
                <Pressable 
                    style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
                    onPress={() => setSelectedTab('overview')}
                >
                    <Ionicons name="analytics" size={20} color={selectedTab === 'overview' ? '#40916C' : '#74C69D'} />
                    <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>Resumen</Text>
                </Pressable>
                <Pressable 
                    style={[styles.tab, selectedTab === 'activities' && styles.activeTab]}
                    onPress={() => setSelectedTab('activities')}
                >
                    <Ionicons name="list" size={20} color={selectedTab === 'activities' ? '#40916C' : '#74C69D'} />
                    <Text style={[styles.tabText, selectedTab === 'activities' && styles.activeTabText]}>Actividades</Text>
                </Pressable>
                <Pressable 
                    style={[styles.tab, selectedTab === 'settings' && styles.activeTab]}
                    onPress={() => setSelectedTab('settings')}
                >
                    <Ionicons name="cog" size={20} color={selectedTab === 'settings' ? '#40916C' : '#74C69D'} />
                    <Text style={[styles.tabText, selectedTab === 'settings' && styles.activeTabText]}>Ajustes</Text>
                </Pressable>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {renderTabContent()}
                </ScrollView>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.circle}>
                    <Image source={require('../../assets/img/LogoFibonatix.png')} style={styles.image} />
                </View>
                <Text style={styles.textFooter}>Frognova</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#74C69D',
        height: Math.max(120, height * 0.12),
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        paddingHorizontal: 20,
    },
    containerButtonBack: {
        marginRight: 20,
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
        fontSize: Math.min(35, width * 0.08),
        color: 'white',
        fontFamily: 'Quicksand',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    headerRight: {
        width: 50,
        alignItems: 'center',
    },
    headerButton: {
        backgroundColor: '#D8F3DC',
        borderRadius: 70,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    profileCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#D8F3DC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatar: {
        fontSize: 30,
    },
    profileInfo: {
        flex: 1,
    },
    childName: {
        fontSize: Math.min(20, width * 0.05),
        color: '#094F2C',
        fontFamily: 'Quicksand',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    childDetails: {
        fontSize: Math.min(14, width * 0.035),
        color: '#40916C',
        fontFamily: 'Quicksand',
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3E0',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    levelText: {
        fontSize: Math.min(12, width * 0.03),
        color: '#F77F00',
        fontFamily: 'Quicksand',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 15,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: '#D8F3DC',
    },
    tabText: {
        fontSize: Math.min(14, width * 0.035),
        color: '#74C69D',
        fontFamily: 'Quicksand',
        marginLeft: 5,
    },
    activeTabText: {
        color: '#40916C',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        marginTop: 10,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    tabContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15,
        flex: 1,
        marginHorizontal: 5,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    statTitle: {
        fontSize: Math.min(12, width * 0.03),
        color: '#6C757D',
        fontFamily: 'Quicksand',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    statValue: {
        fontSize: Math.min(18, width * 0.045),
        fontFamily: 'Quicksand',
        fontWeight: 'bold',
    },
    sectionContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: Math.min(18, width * 0.045),
        color: '#094F2C',
        fontFamily: 'Quicksand',
        fontWeight: 'bold',
        marginBottom: 15,
    },
    progressContainer: {
        gap: 15,
    },
    progressItem: {
        marginBottom: 10,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressSubject: {
        fontSize: Math.min(14, width * 0.035),
        color: '#094F2C',
        fontFamily: 'Quicksand',
        fontWeight: 'bold',
    },
    progressPercentage: {
        fontSize: Math.min(14, width * 0.035),
        color: '#40916C',
        fontFamily: 'Quicksand',
        fontWeight: 'bold',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#E9ECEF',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    activitiesContainer: {
        gap: 15,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    activityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityInfo: {
        flex: 1,
    },
    activityGame: {
        fontSize: Math.min(14, width * 0.035),
        color: '#094F2C',
        fontFamily: 'Quicksand',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    activityTime: {
        fontSize: Math.min(12, width * 0.03),
        color: '#6C757D',
        fontFamily: 'Quicksand',
    },
    activityScore: {
        backgroundColor: '#F8F9FA',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    scoreText: {
        fontSize: Math.min(14, width * 0.035),
        fontFamily: 'Quicksand',
        fontWeight: 'bold',
    },
    settingsContainer: {
        gap: 1,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        marginBottom: 10,
    },
    settingText: {
        flex: 1,
        fontSize: Math.min(16, width * 0.04),
        color: '#094F2C',
        fontFamily: 'Quicksand',
        fontWeight: 'bold',
        marginLeft: 15,
    },
    footer: {
        height: Math.max(120, height * 0.12),
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
        fontSize: Math.min(30, width * 0.07),
        color: 'white',
        fontFamily: 'Quicksand',
        marginTop: 10,
    },
});