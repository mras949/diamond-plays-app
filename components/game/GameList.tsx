import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, TextStyle, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../../constants/theme';
import { useGameData } from '../../contexts/GameDataContext';
import GameAccordion from './GameAccordion';

const GameList: React.FC = () => {
  const { games, refreshGames, refreshAllData, selectPlayer } = useGameData();
  const [refreshing, setRefreshing] = useState(false);
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null);
  const [tabIndexes, setTabIndexes] = useState<Record<string, number>>({});

  // Reset UI state when games change (date change)
  useEffect(() => {
    setExpandedGameId(null);
    setTabIndexes({});
  }, [games]);

  const onRefresh = useCallback(async () => {
    console.log('GameList: onRefresh called');
    setRefreshing(true);
    await refreshAllData();
    setRefreshing(false);
  }, [refreshAllData]);

  const handleToggleExpand = useCallback((gameId: string) => {
    setExpandedGameId(expandedGameId === gameId ? null : gameId);
  }, [expandedGameId]);

  const handleTabChange = useCallback((gameId: string, index: number) => {
    setTabIndexes(prev => ({ ...prev, [gameId]: index }));
  }, []);

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={styles.gamesContainer}>
        {games.length > 0 ? (
          games.map((game) => (
            <GameAccordion
              key={game._id}
              game={game}
              isExpanded={expandedGameId === game._id}
              onToggleExpand={() => handleToggleExpand(game._id)}
              tabIndex={tabIndexes[game._id] || 0}
              onTabChange={(index) => handleTabChange(game._id, index)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No games available for this date</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = {
  scrollContainer: theme.components.scrollContainer as ViewStyle,
  scrollContent: theme.components.scrollContent as ViewStyle,
  gamesContainer: theme.components.contentContainer as ViewStyle,
  emptyText: theme.components.emptyText as TextStyle,
};

export default GameList;