import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { API_BASE_URL } from '../../constants/api';
import { GamePlayer, PlayerListProps } from '../../constants/interfaces';
import { theme } from '../../constants/theme';
import { useAuth } from '../../providers/AuthProvider';

export const PlayerList: React.FC<PlayerListProps> = ({
    gameId,
    teamId,
    onSelectionChange,
}) => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState<GamePlayer[]>([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [savingSelection, setSavingSelection] = useState(false);

    // Fetch existing selection for this game/team
    const fetchExistingSelection = async () => {
        try {
            // Check if user is still authenticated before making API call
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }

            const token = await SecureStore.getItemAsync('jwtToken');
            if (!token) {
                setLoading(false);
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(
                `${API_BASE_URL}/api/selections/${gameId}/${teamId}`,
                { headers }
            );

            if (response.data && response.data.gamePlayer) {
                setSelectedPlayerId(response.data.gamePlayer._id);
            }
        } catch (error) {
            console.error('Error fetching existing selection:', error);
            // If it's an auth error, don't redirect - let the auth guard handle it
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.log('Auth error in fetchExistingSelection - user may have logged out');
            }
        } finally {
            setLoading(false);
        }
    };

    // Save player selection
    const savePlayerSelection = async (gamePlayerId: string) => {
        try {
            // Check if user is still authenticated before making API call
            if (!isAuthenticated) {
                console.log('User not authenticated, skipping save');
                return;
            }

            setSavingSelection(true);
            const token = await SecureStore.getItemAsync('jwtToken');
            if (!token) {
                console.error('No auth token found');
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };

            // If there's an existing selection, delete it first
            if (selectedPlayerId) {
                try {
                    const existingSelection = await axios.get(
                        `${API_BASE_URL}/api/selections/${gameId}/${teamId}`,
                        { headers }
                    );
                    if (existingSelection.data) {
                        await axios.delete(
                            `${API_BASE_URL}/api/selections/${existingSelection.data._id}`,
                            { headers }
                        );
                    }
                } catch (error) {
                    console.error('Error deleting existing selection:', error);
                    // If it's an auth error, don't continue
                    if (axios.isAxiosError(error) && error.response?.status === 401) {
                        console.log('Auth error during delete - user may have logged out');
                        return;
                    }
                }
            }

            // Create new selection
            const response = await axios.post(
                `${API_BASE_URL}/api/selections`,
                { gamePlayerId },
                { headers }
            );

            setSelectedPlayerId(gamePlayerId);
            console.log('Selection saved:', response.data);

            // Notify parent component of selection change
            if (onSelectionChange) {
                onSelectionChange({
                    gameId,
                    teamId,
                    playerId: gamePlayerId,
                });
            }
        } catch (error) {
            console.error('Error saving selection:', error);
            // If it's an auth error, don't redirect - let the auth guard handle it
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.log('Auth error during save - user may have logged out');
            }
        } finally {
            setSavingSelection(false);
        }
    };

    // Handle player selection
    const handlePlayerSelect = async (gamePlayer: GamePlayer) => {
        if (savingSelection) return; // Prevent multiple simultaneous selections

        await savePlayerSelection(gamePlayer._id);
    };

    useEffect(() => {
        async function fetchPlayers() {
            try {
                // Check if user is still authenticated before making API call
                if (!isAuthenticated) {
                    setLoading(false);
                    return;
                }

                const token = await SecureStore.getItemAsync('jwtToken');
                if (!token) {
                    console.error('No auth token found');
                    setLoading(false);
                    return;
                }

                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get(
                    `${API_BASE_URL}/api/data/game-players?gameId=${gameId}&teamId=${teamId}`,
                    { headers }
                );
                console.log('Fetched players:', response.data);
                setPlayers(response.data);
            } catch (error) {
                console.error('Error fetching players:', error);
                // If it's an auth error, don't redirect - let the auth guard handle it
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    console.log('Auth error in fetchPlayers - user may have logged out');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchPlayers();
        fetchExistingSelection();
    }, [gameId, teamId, isAuthenticated]);

    const getPlayerName = (gamePlayer: GamePlayer) => {
        return gamePlayer.name || gamePlayer.player?.name || 'Unknown Player';
    };

    const getPlayerPosition = (gamePlayer: GamePlayer) => {
        return gamePlayer.position || gamePlayer.player?.position || 'Unknown Position';
    };

    const renderPlayerRow = ({ item }: { item: GamePlayer }) => {
        const isSelected = selectedPlayerId === item._id;
        const isSaving = savingSelection && selectedPlayerId === item._id;

        return (
            <TouchableOpacity
                style={[
                    styles.playerRow,
                    isSelected && styles.playerRowSelected,
                    isSaving && styles.playerRowSaving
                ]}
                onPress={() => handlePlayerSelect(item)}
                disabled={savingSelection}
            >
                <View style={styles.playerInfo}>
                    <Text style={[styles.battingOrder, isSelected && styles.textSelected]}>
                        {item.battingOrder}
                    </Text>
                    <Text style={[styles.playerName, isSelected && styles.textSelected]}>
                        {getPlayerName(item)}
                    </Text>
                    {isSelected && (
                        <View style={styles.selectionIndicator}>
                            <Text style={styles.checkmark}>✓</Text>
                        </View>
                    )}
                </View>
                <Text style={[styles.playerPosition, isSelected && styles.textSelected]}>
                    {getPlayerPosition(item)}
                </Text>
                {isSaving && (
                    <ActivityIndicator
                        size="small"
                        color={theme.colors.primary}
                        style={styles.savingIndicator}
                    />
                )}
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (players.length === 0) {
        console.log('No players found for team:', teamId);
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Lineup not set</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={[...players].sort((a, b) => a.battingOrder - b.battingOrder)}
            renderItem={renderPlayerRow}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            style={styles.container}
        />
    );
};

const styles = {
    container: theme.components.container as ViewStyle,
    loadingContainer: theme.components.loadingContainer as ViewStyle,
    emptyContainer: theme.components.emptyContainer as ViewStyle,
    emptyText: theme.components.emptyText as TextStyle,
    playerRow: theme.components.playerRow as ViewStyle,
    playerInfo: theme.components.playerInfo as ViewStyle,
    battingOrder: theme.components.battingOrder as TextStyle,
    playerName: theme.components.playerName as TextStyle,
    playerPosition: theme.components.playerPosition as TextStyle,
    playerRowSelected: {
        backgroundColor: '#e0f2fe', // Light blue background for selected players
        borderBottomColor: theme.colors.primary,
    } as ViewStyle,
    playerRowSaving: {
        opacity: 0.7,
    } as ViewStyle,
    textSelected: {
        color: theme.colors.primary,
        fontWeight: '600',
    } as TextStyle,
    selectionIndicator: {
        marginLeft: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    checkmark: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    } as TextStyle,
    savingIndicator: {
        position: 'absolute',
        right: 8,
    } as ViewStyle,
};
