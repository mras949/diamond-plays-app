import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, TextStyle, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { API_BASE_URL } from '../../constants/api';
import { GamePlayer, PlayerListProps } from '../../constants/interfaces';
import { theme } from '../../constants/theme';

export const PlayerList: React.FC<PlayerListProps> = ({
    gameId,
    teamId,
    onSelectionChange,
}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState<GamePlayer[]>([]);

    useEffect(() => {
        async function fetchPlayers() {
            try {
                const token = await SecureStore.getItemAsync('jwtToken');
                if (!token) {
                    console.error('No auth token found');
                    router.push('/');
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
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    router.push('/');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchPlayers();
    }, [gameId, teamId, router]);

    const getPlayerName = (gamePlayer: GamePlayer) => {
        return gamePlayer.name || gamePlayer.player?.name || 'Unknown Player';
    };

    const getPlayerPosition = (gamePlayer: GamePlayer) => {
        return gamePlayer.position || gamePlayer.player?.position || 'Unknown Position';
    };

    const renderPlayerRow = ({ item }: { item: GamePlayer }) => (
        <View style={styles.playerRow}>
            <View style={styles.playerInfo}>
                <Text style={styles.battingOrder}>{item.battingOrder}</Text>
                <Text style={styles.playerName}>{getPlayerName(item)}</Text>
            </View>
            <Text style={styles.playerPosition}>{getPlayerPosition(item)}</Text>
        </View>
    );

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
};
