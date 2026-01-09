import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { GamePlayer, PlayerListProps } from '../../constants/interfaces';
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
                onPress={() => handlePlayerSelect(item)}
                disabled={savingSelection}
            >
                <View>
                    <Text>
                        {item.battingOrder}
                    </Text>
                    <Text>
                        {getPlayerName(item)}
                    </Text>
                    {isSelected && (
                        <View>
                            <Text>✓</Text>
                        </View>
                    )}
                </View>
                <Text>
                    {getPlayerPosition(item)}
                </Text>
                {isSaving && (
                    <ActivityIndicator
                        size="small"
                        color="#3b82f6"
                    />
                )}
            </TouchableOpacity>
        );
    };

    if (fetchError) {
        return (
            <View>
                <Text>{fetchError}</Text>
                <TouchableOpacity
                    onPress={() => {
                        resetPlayerFetchAttempt(gameId, teamId);
                        setFetchError(null);
                    }}
                >
                    <Text>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (shouldShowLoading) {
        return (
            <View>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    if (currentPlayers.length === 0) {
        return (
            <View>
                <Text>Lineup not set</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={[...currentPlayers].sort((a, b) => a.battingOrder - b.battingOrder)}
            renderItem={renderPlayerRow}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
        />
    );
});

PlayerList.displayName = 'PlayerList';
