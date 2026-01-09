import React, { useCallback, useMemo } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SceneMap, TabView } from 'react-native-tab-view';
import { GameAccordionProps } from '../../constants/interfaces';
import { useCustomTheme } from '../../constants/theme';
import { useGameData } from '../../contexts/GameDataContext';
import { PlayerList } from './PlayerList';





const CustomTabBar = ({ navigationState, jumpTo, position }: any) => {
    const theme = useCustomTheme();

    return (
        <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
            {navigationState.routes.map((route: any, index: number) => {
                const isActive = navigationState.index === index;
                return (
                    <TouchableOpacity
                        key={route.key}
                        style={[
                            {
                                flex: 1,
                                paddingVertical: theme.styles.spacing.md,
                                paddingHorizontal: theme.styles.spacing.lg,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: isActive
                                    ? theme.colors.primary
                                    : theme.colors.surface,
                                borderBottomWidth: isActive ? 2 : 0,
                                borderBottomColor: theme.colors.primary,
                            },
                        ]}
                        onPress={() => jumpTo(route.key)}
                    >
                        <Text
                            style={[
                                {
                                    fontSize: 14,
                                    fontWeight: '600',
                                    color: isActive
                                        ? theme.colors.onPrimary
                                        : theme.colors.onSurface,
                                },
                            ]}
                        >
                            {route.title}
                        </Text>
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
    const theme = useCustomTheme();
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
        <View style={{ flex: 1, padding: theme.styles.spacing.md }}>
            <PlayerList
                gameId={game._id}
                teamId={game.awayTeam._id}
                onSelectionChange={handleSelectionChange}
            />
        </View>
    ), [game._id, game.awayTeam._id, handleSelectionChange, theme]);

    const HomeTab = useCallback(() => (
        <View style={{ flex: 1, padding: theme.styles.spacing.md }}>
            <PlayerList
                gameId={game._id}
                teamId={game.homeTeam._id}
                onSelectionChange={handleSelectionChange}
            />
        </View>
    ), [game._id, game.homeTeam._id, handleSelectionChange, theme]);

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
        <View style={theme.styles.components.card}>
            <TouchableOpacity
                style={[
                    {
                        backgroundColor: theme.colors.surfaceVariant,
                        borderRadius: theme.styles.borderRadius.lg,
                        borderWidth: 1,
                        borderColor: theme.colors.outline,
                        padding: theme.styles.spacing.md,
                    },
                ]}
                onPress={onToggleExpand}
                activeOpacity={0.7}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={theme.styles.components.game.teamSection}>
                        <Text style={theme.styles.components.game.teamCity}>
                            {game.awayTeam.city}
                        </Text>
                        <Text style={theme.styles.components.game.teamName}>
                            {game.awayTeam.teamName}
                        </Text>
                        {selectedPlayers[game.awayTeam._id] ? (
                            <Text style={theme.styles.components.game.playerSelection}>
                                {selectedPlayers[game.awayTeam._id]?.name ||
                                 selectedPlayers[game.awayTeam._id]?.player?.name ||
                                 'Selected Player'}
                            </Text>
                        ) : (
                            <Text style={theme.styles.components.game.noSelection}>
                                No Selection
                            </Text>
                        )}
                    </View>

                    <View style={theme.styles.components.game.status}>
                        <Text style={theme.styles.components.game.statusText}>
                            {game.statusDisplay}
                        </Text>
                        {game.timeDisplay && (
                            <Text style={theme.styles.components.game.timeText}>
                                {game.timeDisplay}
                            </Text>
                        )}
                    </View>

                    <View style={theme.styles.components.game.teamSection}>
                        <Text style={theme.styles.components.game.teamCity}>
                            {game.homeTeam.city}
                        </Text>
                        <Text style={theme.styles.components.game.teamName}>
                            {game.homeTeam.teamName}
                        </Text>
                        {selectedPlayers[game.homeTeam._id] ? (
                            <Text style={theme.styles.components.game.playerSelection}>
                                {selectedPlayers[game.homeTeam._id]?.name ||
                                 selectedPlayers[game.homeTeam._id]?.player?.name ||
                                 'Selected Player'}
                            </Text>
                        ) : (
                            <Text style={theme.styles.components.game.noSelection}>
                                No Selection
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            {isExpanded && (
                <View style={[{
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.outline,
                    borderBottomLeftRadius: theme.styles.borderRadius.lg,
                    borderBottomRightRadius: theme.styles.borderRadius.lg,
                    backgroundColor: theme.colors.surface
                }]}>
                    <View style={{ height: 400 }}>
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

// Styles are now defined in the theme

const GameAccordionMemo = React.memo(GameAccordionComponent);
export default GameAccordionMemo;


