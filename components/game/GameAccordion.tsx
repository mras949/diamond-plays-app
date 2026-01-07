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
        <View className="flex-row h-12 bg-surface border-b border-outline">
            {navigationState.routes.map((route: any, index: number) => {
                const isActive = navigationState.index === index;
                return (
                    <TouchableOpacity
                        key={route.key}
                        className="flex-1 items-center justify-center py-3 px-0 relative min-h-9"
                        onPress={() => jumpTo(route.key)}
                    >
                        <Text
                            className={`text-xs font-medium capitalize text-center ${
                                isActive ? 'text-primary' : 'text-secondary'
                            }`}
                        >
                            {route.title}
                        </Text>
                        {isActive && <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
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
        <View className="flex-1 p-0 bg-background">
            <PlayerList
                gameId={game._id}
                teamId={game.awayTeam._id}
                onSelectionChange={handleSelectionChange}
            />
        </View>
    ), [game._id, game.awayTeam._id, handleSelectionChange]);

    const HomeTab = useCallback(() => (
        <View className="flex-1 p-0 bg-background">
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
        <View className="my-1 bg-surface rounded-md overflow-hidden">
            <TouchableOpacity
                className="py-2.5 px-5 bg-surface"
                onPress={onToggleExpand}
                activeOpacity={0.7}
            >
                <View className="flex-row items-center justify-center gap-4">
                    <View className="w-10/12 items-end">
                        <Text className="text-xs font-light text-on-surface text-center leading-4 tracking-tight">
                            {game.awayTeam.city}
                        </Text>
                        <Text className="text-sm font-black text-on-surface text-center leading-4 tracking-tight">
                            {game.awayTeam.teamName}
                        </Text>
                        {selectedPlayers[game.awayTeam._id] ? (
                            <Text className="text-xs font-normal text-primary text-center tracking-tight">
                                {selectedPlayers[game.awayTeam._id]?.name ||
                                 selectedPlayers[game.awayTeam._id]?.player?.name ||
                                 'Selected Player'}
                            </Text>
                        ) : (
                            <Text className="text-xs font-normal text-secondary text-center tracking-tight">
                                No Selection
                            </Text>
                        )}
                    </View>
                    <View className="w-2/12 items-center gap-0.5">
                        <Text className="text-xs font-medium text-on-surface capitalize text-center p-0 m-0 leading-3 tracking-tight">
                            {getGameStatusDisplay(game)}
                        </Text>
                        {getGameTimeDisplay(game) && (
                            <Text className="text-sm font-black text-on-surface-variant text-center p-0 m-0 leading-3 tracking-tight">
                                {getGameTimeDisplay(game)}
                            </Text>
                        )}
                    </View>
                    <View className="w-10/12 items-start">
                        <Text className="text-xs font-light text-on-surface text-center leading-4 tracking-tight">
                            {game.homeTeam.city}
                        </Text>
                        <Text className="text-sm font-black text-on-surface text-center leading-4 tracking-tight">
                            {game.homeTeam.teamName}
                        </Text>
                        {selectedPlayers[game.homeTeam._id] ? (
                            <Text className="text-xs font-normal text-primary text-center tracking-tight">
                                {selectedPlayers[game.homeTeam._id]?.name ||
                                 selectedPlayers[game.homeTeam._id]?.player?.name ||
                                 'Selected Player'}
                            </Text>
                        ) : (
                            <Text className="text-xs font-normal text-secondary text-center tracking-tight">
                                No Selection
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            {isExpanded && (
                <View className="p-0">
                    <View className="h-80 mt-2 bg-surface">
                        <TabView
                            navigationState={{
                                index: tabIndex,
                                routes: routes
                            }}
                            renderScene={renderScene}
                            onIndexChange={onTabChange}
                            initialLayout={{ width: Dimensions.get('window').width }}
                            renderTabBar={CustomTabBar}
                            className="flex-1"
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

const GameAccordionMemo = React.memo(GameAccordionComponent);
export default GameAccordionMemo;


