import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, TextStyle, View, ViewStyle } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import DateSelector from '../components/forms/DateSelector';
import GameList from '../components/game/GameList';
import { Sidebar } from '../components/navigation/Sidebar';
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
    errorContainer: theme.components.homeErrorContainer as ViewStyle,
    errorTitle: theme.components.homeErrorTitle as TextStyle,
    errorMessage: theme.components.homeErrorMessage as TextStyle,
    errorHint: theme.components.homeErrorHint as TextStyle,
    loadingOverlay: theme.components.homeLoadingOverlay as ViewStyle,
    errorOverlay: theme.components.homeErrorOverlay as ViewStyle,
    errorText: theme.components.homeErrorText as TextStyle,
};

export default HomeScreen;