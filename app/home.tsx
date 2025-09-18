import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, TextStyle, View, ViewStyle } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import DateSelector from '../components/DateSelector';
import GameList from '../components/GameList';
import { Sidebar } from '../components/Sidebar';
import { theme } from '../constants/theme';
import { useGameData } from '../contexts/GameDataContext';
import { useAuth } from '../providers/AuthProvider';

const HomeScreen = () => {
    const router = useRouter();
    const { logout, logoutLoading } = useAuth();
    const { loading, error, refreshGames, refreshAllData } = useGameData();
    const appState = useRef<AppStateStatus>(AppState.currentState);
    const [sidebarVisible, setSidebarVisible] = useState(false);

    // Handle app state changes to trigger refresh when app comes to foreground
    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active' && appState.current !== 'active') {
                // App came to foreground, trigger refresh
                refreshAllData();
            }
            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription?.remove();
        };
    }, [refreshAllData]);

    const handleLogout = async () => {
        if (logoutLoading) return; // Prevent multiple logout calls

        try {
            await logout();
            // Navigate to login screen after logout
            router.replace('/');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setSidebarVisible(false); // Close sidebar after logout
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Action
                    icon="menu"
                    onPress={() => setSidebarVisible(true)}
                />
            </Appbar.Header>
            <DateSelector />
            <GameList />
            <Sidebar
                isVisible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
                onLogout={handleLogout}
                logoutLoading={logoutLoading}
            />
            {loading && (
                <View style={styles.loadingOverlay}>
                    <Text>Loading...</Text>
                </View>
            )}
            {error && (
                <View style={styles.errorOverlay}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );
};

const styles = {
    container: theme.components.container as ViewStyle,
    loadingContainer: theme.components.loadingContainer as ViewStyle,
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        backgroundColor: theme.colors.background,
    } as ViewStyle,
    errorTitle: {
        color: theme.colors.error,
        fontSize: 24,
        fontWeight: 'bold' as const,
        marginBottom: 16,
        textAlign: 'center' as const,
    } as TextStyle,
    errorMessage: {
        color: theme.colors.onSurface,
        fontSize: 16,
        textAlign: 'center' as const,
        marginBottom: 24,
    } as TextStyle,
    errorHint: {
        color: theme.colors.onSurfaceVariant,
        fontSize: 14,
        textAlign: 'center' as const,
        paddingHorizontal: 16,
    } as TextStyle,
    loadingOverlay: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    } as ViewStyle,
    errorOverlay: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 1000,
    } as ViewStyle,
    errorText: {
        color: theme.colors.error,
        fontSize: 16,
        textAlign: 'center',
    } as TextStyle,
};

export default HomeScreen;