import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TextStyle, View, ViewStyle } from 'react-native';
import { Appbar, Button, Text } from 'react-native-paper';
import { GameAccordion } from '../components/game/GameAccordion';
import { API_BASE_URL } from '../constants/api';
import { Game } from '../constants/interfaces';
import { theme } from '../constants/theme';
import { useAuth } from '../providers/AuthProvider';

const HomeScreen = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedGameId, setExpandedGameId] = useState<string | null>(null);
    const [tabIndexes, setTabIndexes] = useState<{ [gameId: string]: number }>({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const router = useRouter();
    const { logout } = useAuth();

    useEffect(() => {
        async function fetchGames() {
            try {
                const token = await SecureStore.getItemAsync('jwtToken');
                if (!token) {
                    console.error('No auth token found');
                    router.push('/');
                    return;
                }

                const headers = { Authorization: `Bearer ${token}` };
                const today = selectedDate.toISOString().split('T')[0];

                const gamesResponse = await axios.get(
                    `${API_BASE_URL}/api/data/games?date=${today}`,
                    { headers }
                );

                const games = gamesResponse.data;
                setGames(games);
            } catch (error) {
                console.error('Error fetching games:', error);
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    router.push('/');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchGames();
    }, [router, selectedDate]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Today's Games" />
                <Appbar.Action icon="logout" onPress={handleLogout} />
            </Appbar.Header>
            <View style={styles.dateSelectorContainer}>
                <Button mode="outlined" onPress={() => setShowDatePicker(true)}>
                    {selectedDate.toLocaleDateString()}
                </Button>
                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowDatePicker(false);
                            if (date) setSelectedDate(date);
                        }}
                    />
                )}
            </View>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.gamesContainer}>
                    {games.map(game => (
                        <GameAccordion
                            key={game._id}
                            game={game}
                            isExpanded={expandedGameId === game._id}
                            onToggleExpand={() => setExpandedGameId(expandedGameId === game._id ? null : game._id)}
                            tabIndex={tabIndexes[game._id] || 0}
                            onTabChange={(index) => setTabIndexes(prev => ({ ...prev, [game._id]: index }))}
                        />
                    ))}
                    {games.length === 0 && (
                        <Text variant="bodyLarge" style={styles.emptyText}>
                            No games scheduled for today.
                        </Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = {
    container: theme.components.container as ViewStyle,
    scrollContainer: theme.components.scrollContainer as ViewStyle,
    scrollContent: theme.components.scrollContent as ViewStyle,
    gamesContainer: theme.components.contentContainer as ViewStyle,
    loadingContainer: theme.components.loadingContainer as ViewStyle,
    emptyText: theme.components.emptyText as TextStyle,
    dateSelectorContainer: theme.components.dateSelectorContainer as ViewStyle,
};

export default HomeScreen;