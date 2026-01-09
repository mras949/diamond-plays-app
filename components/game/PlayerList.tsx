import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { GamePlayer, PlayerListProps } from '../../constants/interfaces';
import { useCustomTheme } from '../../constants/theme';
import { useGameData } from '../../contexts/GameDataContext';
import { useAuth } from '../../providers/AuthProvider';

export const PlayerList: React.FC<PlayerListProps> = React.memo(({
    gameId,
    teamId,
    onSelectionChange,
}) => {
    const theme = useCustomTheme();
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
            
            fetchPlayers(gameId, teamId).then((result) => {
            }).catch((error) => {
                console.log(`[PlayerList] fetchPlayers error for ${gameId}-${teamId}:`, error);
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
        } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
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
                    theme.styles.components.player.playerRow,
                    {
                        backgroundColor: isSelected
                            ? theme.colors.primaryContainer
                            : theme.colors.surface,
                        borderColor: isSelected
                            ? theme.colors.primary
                            : theme.colors.outline,
                    },
                ]}
                onPress={() => handlePlayerSelect(item)}
                disabled={savingSelection}
                activeOpacity={0.7}
            >
                <View style={theme.styles.components.player.playerInfo}>
                    <View style={[theme.styles.components.player.battingOrderContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                        <Text style={[theme.styles.components.player.battingOrder, { color: theme.colors.onSurfaceVariant }]}>
                            {item.battingOrder}
                        </Text>
                    </View>
                    <View style={theme.styles.components.player.playerDetails}>
                        <Text style={[theme.styles.components.player.playerName, { color: theme.colors.onSurface }]}>
                            {getPlayerName(item)}
                        </Text>
                        <Text style={[theme.styles.components.player.playerPosition, { color: theme.colors.onSurfaceVariant }]}>
                            {getPlayerPosition(item)}
                        </Text>
                    </View>
                    {isSelected && (
                        <View style={[theme.styles.components.player.selectionIndicator, { backgroundColor: theme.colors.primary }]}>
                            <Text style={[theme.styles.components.player.checkmark, { color: theme.colors.onPrimary }]}>
                                ✓
                            </Text>
                        </View>
                    )}
                </View>
                {isSaving && (
                    <ActivityIndicator
                        size="small"
                        color={theme.colors.primary}
                        style={theme.styles.components.player.loadingIndicator}
                    />
                )}
            </TouchableOpacity>
        );
    };

    if (fetchError) {
        return (
            <View style={[theme.styles.components.player.centerContainer, { backgroundColor: theme.colors.surface }]}>
                <Text style={[theme.styles.components.player.errorText, { color: theme.colors.error }]}>
                    {fetchError}
                </Text>
                <TouchableOpacity
                    style={[theme.styles.components.player.retryButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => {
                        resetPlayerFetchAttempt(gameId, teamId);
                        setFetchError(null);
                    }}
                >
                    <Text style={[theme.styles.components.player.retryText, { color: theme.colors.onPrimary }]}>
                        Retry
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (shouldShowLoading) {
        return (
            <View style={[theme.styles.components.player.centerContainer, { backgroundColor: theme.colors.surface }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (currentPlayers.length === 0) {
        return (
            <View style={[theme.styles.components.player.centerContainer, { backgroundColor: theme.colors.surface }]}>
                <Text style={[theme.styles.components.player.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                    Lineup not set
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            style={[theme.styles.components.player.listContainer, { backgroundColor: theme.colors.surface }]}
            data={[...currentPlayers].sort((a, b) => a.battingOrder - b.battingOrder)}
            renderItem={renderPlayerRow}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={[theme.styles.components.player.separator, { backgroundColor: theme.colors.outline }]} />}
        />
    );
});

PlayerList.displayName = 'PlayerList';
