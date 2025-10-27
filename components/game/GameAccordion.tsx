import React, { useCallback, useMemo } from 'react';
import { Dimensions, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { SceneMap, TabView } from 'react-native-tab-view';
import { GameAccordionProps } from '../../constants/interfaces';
import { theme } from '../../constants/theme';
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
        <View style={[styles.tabBar, styles.customTabBar]}>
            {navigationState.routes.map((route: any, index: number) => {
                const isActive = navigationState.index === index;
                return (
                    <TouchableOpacity
                        key={route.key}
                        style={styles.tabItem}
                        onPress={() => jumpTo(route.key)}
                    >
                        <Text
                            style={[
                                styles.tabLabel,
                                {
                                    color: isActive ? '#3b82f6' : '#71717a',
                                    fontSize: 12,
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    includeFontPadding: false,
                                    textAlignVertical: 'center'
                                }
                            ]}
                        >
                            {route.title}
                        </Text>
                        {isActive && <View style={styles.tabIndicatorActive} />}
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
        <View style={styles.tabContent}>
            <PlayerList
                gameId={game._id}
                teamId={game.awayTeam._id}
                onSelectionChange={handleSelectionChange}
            />
        </View>
    ), [game._id, game.awayTeam._id, handleSelectionChange]);

    const HomeTab = useCallback(() => (
        <View style={styles.tabContent}>
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
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.accordionTrigger, isExpanded && styles.accordionTriggerExpanded]}
                onPress={onToggleExpand}
                activeOpacity={0.7}
            >
                <View style={styles.triggerContent}>
                    <View style={styles.awayTeamSection}>
                        <Text variant="titleMedium" style={styles.teamCity}>
                            {game.awayTeam.city}
                        </Text>
                        <Text variant="titleMedium" style={styles.teamName}>
                            {game.awayTeam.teamName}
                        </Text>
                        {selectedPlayers[game.awayTeam._id] ? (
                            <Text variant="bodySmall" style={styles.selectedPlayer}>
                                {selectedPlayers[game.awayTeam._id]?.name || 
                                 selectedPlayers[game.awayTeam._id]?.player?.name || 
                                 'Selected Player'}
                            </Text>
                        ) : (
                            <Text variant="bodySmall" style={styles.noSelection}>
                                No Selection
                            </Text>
                        )}
                    </View>
                    <View style={styles.centerSection}>
                        <Text variant="bodyMedium" style={styles.gameStatus}>
                            {getGameStatusDisplay(game)}
                        </Text>
                        {getGameTimeDisplay(game) && (
                            <Text variant="bodyMedium" style={styles.gameDateTime}>
                                {getGameTimeDisplay(game)}
                            </Text>
                        )}
                    </View>
                    <View style={styles.homeTeamSection}>
                        <Text variant="titleMedium" style={styles.teamCity}>
                            {game.homeTeam.city}
                        </Text>
                        <Text variant="titleMedium" style={styles.teamName}>
                            {game.homeTeam.teamName}
                        </Text>
                        {selectedPlayers[game.homeTeam._id] ? (
                            <Text variant="bodySmall" style={styles.selectedPlayer}>
                                {selectedPlayers[game.homeTeam._id]?.name || 
                                 selectedPlayers[game.homeTeam._id]?.player?.name || 
                                 'Selected Player'}
                            </Text>
                        ) : (
                            <Text variant="bodySmall" style={styles.noSelection}>
                                No Selection
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.expandedContent}>
                    <View style={styles.tabViewContainer}>
                        <TabView
                            navigationState={{
                                index: tabIndex,
                                routes: routes
                            }}
                            renderScene={renderScene}
                            onIndexChange={onTabChange}
                            initialLayout={{ width: Dimensions.get('window').width }}
                            renderTabBar={CustomTabBar}
                            style={styles.tabView}
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

const GameAccordionMemo = React.memo(GameAccordionComponent);
export default GameAccordionMemo;

const styles = {
    container: theme.components.gameAccordionContainer as ViewStyle,
    accordionTrigger: theme.components.gameAccordionTrigger as ViewStyle,
    accordionTriggerExpanded: theme.components.gameAccordionTriggerExpanded as ViewStyle,
    triggerContent: theme.components.gameAccordionTriggerContent as ViewStyle,
    homeTeamSection: theme.components.gameAccordionHomeTeamSection as ViewStyle,
    awayTeamSection: theme.components.gameAccordionAwayTeamSection as ViewStyle,
    centerSection: theme.components.gameAccordionCenterSection as ViewStyle,
    titleRow: theme.components.gameAccordionTitleRow as ViewStyle,
    vsText: theme.components.gameAccordionVsText as TextStyle,
    statusRow: theme.components.gameAccordionStatusRow as ViewStyle,
    teamCity: theme.components.gameAccordionTeamCity as TextStyle,
    teamName: theme.components.gameAccordionTeamName as TextStyle,
    selectedPlayer: theme.components.gameAccordionSelectedPlayer as TextStyle,
    noSelection: theme.components.gameAccordionNoSelection as TextStyle,
    gameStatus: theme.components.gameAccordionGameStatus as TextStyle,
    gameDateTime: theme.components.gameAccordionGameDateTime as TextStyle,
    expandedContent: theme.components.expandedContent as ViewStyle,
    tabViewContainer: theme.components.tabViewContainer as ViewStyle,
    tabBar: theme.components.tabBar as ViewStyle,
    tabIndicator: theme.components.tabIndicator as ViewStyle,
    tabView: theme.components.tabView as ViewStyle,
    tabContent: theme.components.tabContent as ViewStyle,
    customTabBar: theme.components.gameAccordionCustomTabBar as ViewStyle,
    tabLabel: theme.components.gameAccordionTabLabel as TextStyle,
    tabItem: theme.components.gameAccordionTabItem as ViewStyle,
    tabIndicatorActive: theme.components.gameAccordionTabIndicatorActive as ViewStyle,
};
