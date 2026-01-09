import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import DateSelector from '../components/forms/DateSelector';
import GameList from '../components/game/GameList';
import { Sidebar } from '../components/navigation/Sidebar';
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
        <View>
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
                <View>
                    <Text>Loading...</Text>
                </View>
            )}
            {error && (
                <View>
                    <Text>{error}</Text>
                </View>
            )}
        </View>
    );
};



export default HomeScreen;