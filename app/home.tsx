import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import DateSelector from '../components/forms/DateSelector';
import GameList from '../components/game/GameList';
import { Sidebar } from '../components/navigation/Sidebar';
import { useCustomTheme } from '../constants/theme';
import { useGameData } from '../contexts/GameDataContext';
import { useAuth } from '../providers/AuthProvider';

const HomeScreen = () => {
    const router = useRouter();
    const { logout, logoutLoading } = useAuth();
    const { loading, error, refreshAllData } = useGameData();
    const appState = useRef<AppStateStatus>(AppState.currentState);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const theme = useCustomTheme();

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
        <View style={theme.styles.components.screen}>
            <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
                <Appbar.Action
                    icon="menu"
                    onPress={() => setSidebarVisible(true)}
                    color={theme.colors.onSurface}
                />
                <Appbar.Content
                    title="Diamond Plays"
                    titleStyle={{ color: theme.colors.onSurface }}
                />
            </Appbar.Header>

            <View style={theme.styles.components.screen}>
                <DateSelector />
                <GameList />
            </View>

            <Sidebar
                isVisible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
                onLogout={handleLogout}
                logoutLoading={logoutLoading}
            />

            {loading && (
                <View style={[theme.styles.components.overlay, { backgroundColor: theme.colors.backdrop }]}>
                    <Text style={[theme.styles.components.text.body, { color: theme.colors.onSurface }]}>
                        Loading...
                    </Text>
                </View>
            )}

            {error && (
                <View style={[{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 16,
                    alignItems: 'center',
                    backgroundColor: theme.colors.errorContainer
                }]}>
                    <Text style={[theme.styles.components.text.body, { color: theme.colors.onErrorContainer }]}>
                        {error}
                    </Text>
                </View>
            )}
        </View>
    );
};



// Styles are now defined in the theme

export default HomeScreen;