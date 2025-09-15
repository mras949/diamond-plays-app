import React from 'react';
import { Dimensions, View, ViewStyle } from 'react-native';
import { List } from 'react-native-paper';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { GameAccordionProps } from '../../constants/interfaces';
import { theme } from '../../constants/theme';
import { GameDetails } from './GameDetails';
import { PlayerList } from './PlayerList';

export const GameAccordion: React.FC<GameAccordionProps> = ({
    game,
    isExpanded,
    onToggleExpand,
    tabIndex,
    onTabChange,
}) => {
    const AwayTab = () => (
        <View style={styles.tabContent}>
            <PlayerList
                gameId={game._id}
                teamId={game.awayTeam._id}
                onSelectionChange={() => {}}
            />
        </View>
    );

    const HomeTab = () => (
        <View style={styles.tabContent}>
            <PlayerList
                gameId={game._id}
                teamId={game.homeTeam._id}
                onSelectionChange={() => {}}
            />
        </View>
    );

    return (
        <List.Accordion
            title={`${game.awayTeam.name} @ ${game.homeTeam.name}`}
            expanded={isExpanded}
            onPress={onToggleExpand}
            style={styles.accordion}
        >
            <View style={styles.expandedContent}>
                <GameDetails
                    status={game.status}
                    awayScore={game.awayScore}
                    homeScore={game.homeScore}
                    date={game.dateTime}
                />
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
                        renderTabBar={(props) => (
                            <TabBar
                                {...props}
                                style={styles.tabBar}
                                indicatorStyle={styles.tabIndicator}
                                activeColor={theme.colors.primary}
                                inactiveColor={theme.colors.secondary}
                            />
                        )}
                        style={styles.tabView}
                    />
                </View>
            </View>
        </List.Accordion>
    );
};

const styles = {
    accordion: theme.components.accordion as ViewStyle,
    expandedContent: theme.components.expandedContent as ViewStyle,
    tabViewContainer: theme.components.tabViewContainer as ViewStyle,
    tabBar: theme.components.tabBar as ViewStyle,
    tabIndicator: theme.components.tabIndicator as ViewStyle,
    tabView: theme.components.tabView as ViewStyle,
    tabContent: theme.components.tabContent as ViewStyle,
};
