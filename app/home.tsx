import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { GameAccordion } from '../components/game/GameAccordion';
import { API_BASE_URL } from '../constants/api';
import { Game } from '../constants/interfaces';
import { theme } from '../constants/theme';
import { useAuth } from '../providers/AuthProvider';

const HomeScreen = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedGameId, setExpandedGameId] = useState<string | null>(null);
    const [tabIndexes, setTabIndexes] = useState<{ [gameId: string]: number }>({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selections, setSelections] = useState<{ [key: string]: string }>({}); // gameId-teamId -> playerId
    const router = useRouter();
    const { logout, logoutLoading } = useAuth();
    const dateScrollRef = useRef<ScrollView>(null);

    // Generate dates for horizontal scrolling (7 days before and after selected date)
    const generateDateList = (centerDate: Date) => {
        const dates = [];
        for (let i = -7; i <= 7; i++) {
            const date = new Date(centerDate);
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const dateList = generateDateList(selectedDate);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    const formatDateForDisplay = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    // Scroll today's date into view when component mounts
    useEffect(() => {
        const today = new Date();
        const todayIndex = dateList.findIndex(date =>
            date.toDateString() === today.toDateString()
        );

        if (todayIndex !== -1 && dateScrollRef.current) {
            // More accurate calculation accounting for ScrollView padding
            const itemWidth = 70; // Actual width of date item
            const itemMargin = 8; // Margin on each side (marginHorizontal: 4 = 8px total)
            const scrollViewPadding = 8; // paddingHorizontal from dateScrollContent
            const totalItemWidth = itemWidth + (itemMargin * 2); // 70 + 16 = 86px

            // Calculate position to center the item in the viewport
            const screenWidth = Dimensions.get('window').width;
            const centerOffset = screenWidth / 2;
            const itemCenterOffset = itemWidth / 2;

            // Account for ScrollView padding in the calculation
            const scrollPosition = (todayIndex * totalItemWidth) + scrollViewPadding - centerOffset + itemCenterOffset;

            console.log('Improved scroll calculation:', {
                todayIndex,
                itemWidth,
                totalItemWidth,
                scrollViewPadding,
                screenWidth,
                centerOffset,
                itemCenterOffset,
                finalScrollPosition: Math.max(0, scrollPosition)
            });

            // Use multiple attempts with increasing delays to ensure proper scrolling
            const scrollToPosition = () => {
                dateScrollRef.current?.scrollTo({
                    x: Math.max(0, scrollPosition),
                    animated: true
                });
            };

            setTimeout(scrollToPosition, 100);
            setTimeout(scrollToPosition, 300);
            setTimeout(scrollToPosition, 600);
        }
    }, [dateList]);

    // Also scroll when loading is complete
    useEffect(() => {
        if (!loading) {
            const today = new Date();
            const todayIndex = dateList.findIndex(date =>
                date.toDateString() === today.toDateString()
            );

            if (todayIndex !== -1 && dateScrollRef.current) {
                const itemWidth = 70;
                const itemMargin = 8;
                const scrollViewPadding = 8;
                const totalItemWidth = itemWidth + (itemMargin * 2);
                const screenWidth = Dimensions.get('window').width;
                const centerOffset = screenWidth / 2;
                const itemCenterOffset = itemWidth / 2;
                const scrollPosition = (todayIndex * totalItemWidth) + scrollViewPadding - centerOffset + itemCenterOffset;

                setTimeout(() => {
                    dateScrollRef.current?.scrollTo({
                        x: Math.max(0, scrollPosition),
                        animated: true
                    });
                }, 200);
            }
        }
    }, [loading, dateList]);

    const isDateSelectable = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate.getTime() <= today.getTime();
    };

    useEffect(() => {
        async function fetchGames() {
            try {
                const token = await SecureStore.getItemAsync('jwtToken');
                if (!token) {
                    console.error('No auth token found');
                    router.push('/');
                    return;
                }

                const headers = { Authorization: `Bearer ${token}` };
                const today = selectedDate.toISOString().split('T')[0];

                const gamesResponse = await axios.get(
                    `${API_BASE_URL}/api/data/games?date=${today}`,
                    { headers }
                );

                const games = gamesResponse.data;
                // Sort games by dateTime in ascending order (earliest first)
                const sortedGames = games.sort((a: Game, b: Game) => {
                    const dateA = new Date(a.dateTime).getTime();
                    const dateB = new Date(b.dateTime).getTime();
                    return dateA - dateB; // Ascending order
                });
                setGames(sortedGames);
            } catch (error) {
                console.error('Error fetching games:', error);
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    router.push('/');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchGames();
    }, [router, selectedDate]);

    const handleLogout = async () => {
        if (logoutLoading) return; // Prevent multiple logout calls
        
        try {
            await logout();
            // Navigate to login screen after logout
            router.replace('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleSelectionChange = (selection: { gameId: string; teamId: string; playerId: string }) => {
        const key = `${selection.gameId}-${selection.teamId}`;
        setSelections(prev => ({
            ...prev,
            [key]: selection.playerId
        }));
        console.log('Selection updated:', selection);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Action 
                    icon={logoutLoading ? "loading" : "logout"} 
                    onPress={handleLogout}
                    disabled={logoutLoading}
                />
            </Appbar.Header>
            <View style={styles.dateSelectorContainer}>
                <ScrollView
                    ref={dateScrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.dateScrollContent}
                    style={styles.dateScrollView}
                >
                    {dateList.map((date, index) => {
                        const isSelected = date.toDateString() === selectedDate.toDateString();
                        const isSelectable = isDateSelectable(date);
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dateItem,
                                    isSelected && styles.dateItemSelected,
                                    !isSelectable && styles.dateItemDisabled
                                ]}
                                onPress={() => isSelectable && handleDateSelect(date)}
                                disabled={!isSelectable}
                            >
                                <Text style={[
                                    styles.dateItemText,
                                    isSelected && styles.dateItemTextSelected,
                                    !isSelectable && styles.dateItemTextDisabled
                                ]}>
                                    {formatDateForDisplay(date)}
                                </Text>
                                <Text style={[
                                    styles.dateItemSubText,
                                    isSelected && styles.dateItemSubTextSelected,
                                    !isSelectable && styles.dateItemSubTextDisabled
                                ]}>
                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.gamesContainer}>
                    {games.map(game => (
                        <GameAccordion
                            key={game._id}
                            game={game}
                            isExpanded={expandedGameId === game._id}
                            onToggleExpand={() => setExpandedGameId(expandedGameId === game._id ? null : game._id)}
                            tabIndex={tabIndexes[game._id] || 0}
                            onTabChange={(index) => setTabIndexes(prev => ({ ...prev, [game._id]: index }))}
                            onSelectionChange={handleSelectionChange}
                        />
                    ))}
                    {games.length === 0 && (
                        <Text variant="bodyLarge" style={styles.emptyText}>
                            No games scheduled for today.
                        </Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = {
    container: theme.components.container as ViewStyle,
    scrollContainer: theme.components.scrollContainer as ViewStyle,
    scrollContent: theme.components.scrollContent as ViewStyle,
    gamesContainer: theme.components.contentContainer as ViewStyle,
    loadingContainer: theme.components.loadingContainer as ViewStyle,
    emptyText: theme.components.emptyText as TextStyle,
    dateSelectorContainer: {
        paddingVertical: 4,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.surface,
    } as ViewStyle,
    dateScrollView: {
        height: 40,
    } as ViewStyle,
    dateScrollContent: {
        paddingHorizontal: 8,
        alignItems: 'center',
    } as ViewStyle,
    dateItem: {
        width: 70,
        height: 40,
        marginHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    dateItemSelected: {

    } as ViewStyle,
    dateItemDisabled: {
        opacity: 0.5,
    } as ViewStyle,
    dateItemText: {
        fontSize: 10,
        fontWeight: '600',
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
        lineHeight: 10,
    } as TextStyle,
    dateItemTextSelected: {
        color: theme.colors.primary,
    } as TextStyle,
    dateItemTextDisabled: {
        color: theme.colors.onSurfaceVariant,
        opacity: 0.5,
    } as TextStyle,
    dateItemSubText: {
        fontSize: 10,
        color: theme.colors.onSurfaceVariant,
        opacity: 0.7,
        textAlign: 'center',
        marginTop: 2,
        lineHeight: 10,
    } as TextStyle,
    dateItemSubTextSelected: {
        color: theme.colors.primary,
        opacity: 0.9,
    } as TextStyle,
    dateItemSubTextDisabled: {
        color: theme.colors.onSurfaceVariant,
        opacity: 0.5,
    } as TextStyle,
};

export default HomeScreen;