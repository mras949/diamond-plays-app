import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { GamePlayer, PlayerListProps } from '../../constants/interfaces';
import { theme } from '../../constants/theme';
import { useGameData } from '../../contexts/GameDataContext';
import { useAuth } from '../../providers/AuthProvider';

export const PlayerList: React.FC<PlayerListProps> = React.memo(({
    gameId,
    teamId,
    onSelectionChange,
}) => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { players, playerLoading, selectedPlayers, fetchPlayers, selectPlayer, playerFetchAttempts, resetPlayerFetchAttempt } = useGameData();
    const [savingSelection, setSavingSelection] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const currentPlayers = players[teamId] || [];
    const isLoading = playerLoading[`${gameId}-${teamId}`] || false;
    const selectedPlayer = selectedPlayers[teamId];

    // If we've attempted to fetch and have data (or know there is no data), don't show loading
    const fetchKey = `${gameId}-${teamId}`;
    const hasAttemptedFetch = playerFetchAttempts[fetchKey];
    const shouldShowLoading = isLoading && !hasAttemptedFetch;

    // Fetch players when component mounts
    useEffect(() => {
        const fetchKey = `${gameId}-${teamId}`;
        // Always try to fetch if we haven't attempted it yet, regardless of cached data
        if (isAuthenticated && !playerFetchAttempts[fetchKey]) {
            setFetchError(null); // Clear any previous errors
            
            fetchPlayers(gameId, teamId).catch((error) => {
                setFetchError('Failed to load players');
            });
        }
    }, [gameId, teamId, isAuthenticated, fetchPlayers, playerFetchAttempts]);

    // Save player selection
    const savePlayerSelection = async (gamePlayerId: string) => {
        try {
            setSavingSelection(true);

            await selectPlayer(gamePlayerId);

            // Notify parent component of selection change
            if (onSelectionChange) {
                onSelectionChange({
                    gameId,
                    teamId,
                    playerId: gamePlayerId,
                });
            }
        } catch (error) {
        } finally {
            setSavingSelection(false);
        }
    };

    // Handle player selection
    const handlePlayerSelect = async (gamePlayer: GamePlayer) => {
        if (savingSelection) return; // Prevent multiple simultaneous selections

        await savePlayerSelection(gamePlayer._id);
    };

    const getPlayerName = (gamePlayer: GamePlayer) => {
        return gamePlayer.name || gamePlayer.player?.name || 'Unknown Player';
    };

    const getPlayerPosition = (gamePlayer: GamePlayer) => {
        return gamePlayer.position || gamePlayer.player?.position || 'Unknown Position';
    };

    const renderPlayerRow = ({ item }: { item: GamePlayer }) => {
        const isSelected = selectedPlayer?._id === item._id;
        const isSaving = savingSelection && selectedPlayer?._id === item._id;

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

    if (fetchError) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{fetchError}</Text>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => {
                        resetPlayerFetchAttempt(gameId, teamId);
                        setFetchError(null);
                    }}
                >
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (shouldShowLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (currentPlayers.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Lineup not set</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={[...currentPlayers].sort((a, b) => a.battingOrder - b.battingOrder)}
            renderItem={renderPlayerRow}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            style={styles.container}
        />
    );
});

PlayerList.displayName = 'PlayerList';

const styles = {
    container: theme.components.container as ViewStyle,
    loadingContainer: theme.components.loadingContainer as ViewStyle,
    emptyContainer: theme.components.emptyContainer as ViewStyle,
    errorContainer: {
        ...theme.components.emptyContainer,
        backgroundColor: '#fff3f3',
        borderColor: '#f5c6cb',
        borderWidth: 1,
        borderRadius: 4,
        padding: 16,
    } as ViewStyle,
    emptyText: theme.components.emptyText as TextStyle,
    errorText: {
        color: '#721c24',
        fontSize: 14,
        textAlign: 'center',
    } as TextStyle,
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
    retryButton: {
        marginTop: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 4,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
    } as ViewStyle,
    retryText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
    } as TextStyle,
};
