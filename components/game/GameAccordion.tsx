import React, { useCallback, useMemo } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SceneMap, TabView } from 'react-native-tab-view';
import { GameAccordionProps } from '../../constants/interfaces';
import { useGameData } from '../../contexts/GameDataContext';
import { useAuth } from '../../providers/AuthProvider';
import { PlayerList } from './PlayerList';

// Helper function to format game status display
const getGameStatusDisplay = (game: any): string => {
    switch (game.status) {
        case 'in_progress':
            return 'Live';
        case 'completed':
            return 'Final';
        case 'scheduled':
            return 'Game Time';
        case 'postponed':
            return 'Postponed';
        case 'delayed':
            return 'Delayed';
        case 'suspended':
            return 'Suspended';
        default:
            return game.status || 'Unknown';
    }
};

// Helper function to format game time/inning display
const getGameTimeDisplay = (game: any): string => {
    if (game.status === 'completed') {
        return ''; // No time for completed games
    }
    
    if (game.status === 'in_progress') {
        // Combine inning state and inning ordinal for live games
        if (game.inningState && game.inningOrdinal) {
            return `${game.inningState} ${game.inningOrdinal}`;
        } else if (game.inningOrdinal) {
            return game.inningOrdinal;
        }
    }
    
    // For scheduled games, show the time
    if (game.dateTime) {
        return new Date(game.dateTime).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    return '';
};

const CustomTabBar = ({ navigationState, jumpTo, position }: any) => {
    return (
        <View>
            {navigationState.routes.map((route: any, index: number) => {
                const isActive = navigationState.index === index;
                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={() => jumpTo(route.key)}
                    >
                        <Text>
                            {route.title}
                        </Text>
                        {isActive && <View />}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const GameAccordionComponent: React.FC<GameAccordionProps> = ({
    game,
    isExpanded,
    onToggleExpand,
    tabIndex,
    onTabChange,
}) => {
    const { isAuthenticated } = useAuth();
    const { selectedPlayers, selectPlayer } = useGameData();

    // Update selections when onSelectionChange is called
    const handleSelectionChange = useCallback(async (selection: { gameId: string; teamId: string; playerId: string }) => {
        try {
            await selectPlayer(selection.playerId);
        } catch (error) {
            console.error('Error saving player selection:', error);
        }
    }, [selectPlayer]);

    // Memoize tab components to prevent re-renders
    const AwayTab = useCallback(() => (
        <View>
            <PlayerList
                gameId={game._id}
                teamId={game.awayTeam._id}
                onSelectionChange={handleSelectionChange}
            />
        </View>
    ), [game._id, game.awayTeam._id, handleSelectionChange]);

    const HomeTab = useCallback(() => (
        <View>
            <PlayerList
                gameId={game._id}
                teamId={game.homeTeam._id}
                onSelectionChange={handleSelectionChange}
            />
        </View>
    ), [game._id, game.homeTeam._id, handleSelectionChange]);

    // Memoize routes to prevent TabView re-renders
    const routes = useMemo(() => [
        { key: 'away', title: game.awayTeam.name },
        { key: 'home', title: game.homeTeam.name }
    ], [game.awayTeam.name, game.homeTeam.name]);

    // Memoize scene map
    const renderScene = useMemo(() => SceneMap({
        away: AwayTab,
        home: HomeTab,
    }), [AwayTab, HomeTab]);

    return (
        <View>
            <TouchableOpacity
                onPress={onToggleExpand}
                activeOpacity={0.7}
            >
                <View>
                    <View>
                        <Text>
                            {game.awayTeam.city}
                        </Text>
                        <Text>
                            {game.awayTeam.teamName}
                        </Text>
                        {selectedPlayers[game.awayTeam._id] ? (
                            <Text>
                                {selectedPlayers[game.awayTeam._id]?.name ||
                                 selectedPlayers[game.awayTeam._id]?.player?.name ||
                                 'Selected Player'}
                            </Text>
                        ) : (
                            <Text>
                                No Selection
                            </Text>
                        )}
                    </View>
                    <View>
                        <Text>
                            {getGameStatusDisplay(game)}
                        </Text>
                        {getGameTimeDisplay(game) && (
                            <Text>
                                {getGameTimeDisplay(game)}
                            </Text>
                        )}
                    </View>
                    <View>
                        <Text>
                            {game.homeTeam.city}
                        </Text>
                        <Text>
                            {game.homeTeam.teamName}
                        </Text>
                        {selectedPlayers[game.homeTeam._id] ? (
                            <Text>
                                {selectedPlayers[game.homeTeam._id]?.name ||
                                 selectedPlayers[game.homeTeam._id]?.player?.name ||
                                 'Selected Player'}
                            </Text>
                        ) : (
                            <Text>
                                No Selection
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            {isExpanded && (
                <View>
                    <View>
                        <TabView
                            navigationState={{
                                index: tabIndex,
                                routes: routes
                            }}
                            renderScene={renderScene}
                            onIndexChange={onTabChange}
                            initialLayout={{ width: Dimensions.get('window').width }}
                            renderTabBar={CustomTabBar}
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

const GameAccordionMemo = React.memo(GameAccordionComponent);
export default GameAccordionMemo;


