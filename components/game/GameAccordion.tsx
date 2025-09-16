import React from 'react';
import { Dimensions, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { SceneMap, TabView } from 'react-native-tab-view';
import { GameAccordionProps } from '../../constants/interfaces';
import { theme } from '../../constants/theme';
import { PlayerList } from './PlayerList';

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

export const GameAccordion: React.FC<GameAccordionProps> = ({
    game,
    isExpanded,
    onToggleExpand,
    tabIndex,
    onTabChange,
    onSelectionChange,
}) => {
    const AwayTab = () => (
        <View style={styles.tabContent}>
            <PlayerList
                gameId={game._id}
                teamId={game.awayTeam._id}
                onSelectionChange={onSelectionChange}
            />
        </View>
    );

    const HomeTab = () => (
        <View style={styles.tabContent}>
            <PlayerList
                gameId={game._id}
                teamId={game.homeTeam._id}
                onSelectionChange={onSelectionChange}
            />
        </View>
    );

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
                    </View>
                    <View style={styles.centerSection}>
                        <Text variant="bodyMedium" style={styles.gameStatus}>
                            {game.status}
                        </Text>
                        <Text variant="bodyMedium" style={styles.gameDateTime}>
                            {new Date(game.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                    <View style={styles.homeTeamSection}>
                        <Text variant="titleMedium" style={styles.teamCity}>
                            {game.homeTeam.city}
                        </Text>
                        <Text variant="titleMedium" style={styles.teamName}>
                            {game.homeTeam.teamName}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.expandedContent}>
                    <View style={styles.tabViewContainer}>
                        <TabView
                            navigationState={{
                                index: tabIndex,
                                routes: [
                                    { key: 'away', title: game.awayTeam.name },
                                    { key: 'home', title: game.homeTeam.name }
                                ]
                            }}
                            renderScene={SceneMap({
                                away: AwayTab,
                                home: HomeTab,
                            })}
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

const styles = {
    container: {
        marginVertical: 4,
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        overflow: 'hidden',
    } as ViewStyle,
    accordionTrigger: {
        padding: 16,
        backgroundColor: theme.colors.surface,
    } as ViewStyle,
    accordionTriggerExpanded: {
        borderBottomWidth: 0,
    } as ViewStyle,
    triggerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    } as ViewStyle,
    homeTeamSection: {
        width: 120,
        alignItems: 'flex-end',
    } as ViewStyle,
    awayTeamSection: {
        width: 120,
        alignItems: 'flex-start',
    } as ViewStyle,
    centerSection: {
        alignItems: 'center',
        gap: 0,
        marginHorizontal: 12,
    } as ViewStyle,
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    } as ViewStyle,
    vsText: {
        fontSize: 14,
        fontWeight: '400' as const,
        color: theme.colors.onSurfaceVariant,
        opacity: 0.8,
    },
    statusRow: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
    } as ViewStyle,
    teamCity: {
        fontSize: 10,
        fontWeight: '300' as const,
        color: theme.colors.onSurface,
        textAlign: 'center' as const,
        lineHeight: 14,
        letterSpacing: -.5,
    },
    teamName: {
        fontSize: 14,
        fontWeight: '800' as const,
        color: theme.colors.onSurface,
        textAlign: 'center' as const,
        lineHeight: 16,
        letterSpacing: -.2,
    },
    gameStatus: {
        fontSize: 8,
        fontWeight: '500' as const,
        color: theme.colors.text,
        textTransform: 'capitalize' as const,
        textAlign: 'center' as const,
        padding: 0,
        margin: 0,
        lineHeight: 12,
        letterSpacing: -.5,
    },
    gameDateTime: {
        fontSize: 10,
        fontWeight: '800' as const,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center' as const,
        padding: 0,
        margin: 0,
        lineHeight: 12,
        letterSpacing: -.5,
    },
    expandedContent: theme.components.expandedContent as ViewStyle,
    tabViewContainer: theme.components.tabViewContainer as ViewStyle,
    tabBar: theme.components.tabBar as ViewStyle,
    tabIndicator: theme.components.tabIndicator as ViewStyle,
    tabView: theme.components.tabView as ViewStyle,
    tabContent: theme.components.tabContent as ViewStyle,
    customTabBar: {
        flexDirection: 'row',
        height: 48,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    } as ViewStyle,
    tabLabel: {
        fontSize: 12,
        fontWeight: '500' as const,
        textTransform: 'capitalize' as const,
        color: '#71717a', // Default color for inactive tabs
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        position: 'relative',
        minHeight: 36,
    } as ViewStyle,
    tabIndicatorActive: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: theme.colors.primary,
    } as ViewStyle,
};
