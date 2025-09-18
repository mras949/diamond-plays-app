import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../constants/api';
import { Game, GamePlayer } from '../constants/interfaces';
import { useAuth } from '../providers/AuthProvider';

interface GameDataContextType {
  // State
  selectedDate: Date;
  games: Game[];
  loading: boolean;
  error: string | null;

  // Player state
  selectedPlayers: Record<string, GamePlayer | null>; // teamId -> selected player
  players: Record<string, GamePlayer[]>; // teamId -> players array
  playerLoading: Record<string, boolean>; // teamId -> loading state
  playerFetchAttempts: Record<string, boolean>; // teamId -> fetch attempted

  // Actions
  setSelectedDate: (date: Date) => void;
  refreshGames: () => Promise<void>;
  refreshAllData: () => Promise<void>;
  selectPlayer: (gamePlayerId: string) => Promise<void>; // Changed to accept gamePlayerId
  fetchPlayers: (gameId: string, teamId: string) => Promise<void>;
  resetPlayerFetchAttempt: (gameId: string, teamId: string) => void;
}

const GameDataContext = createContext<GameDataContextType | undefined>(undefined);

export const useGameData = () => {
  const context = useContext(GameDataContext);
  if (!context) {
    throw new Error('useGameData must be used within a GameDataProvider');
  }
  return context;
};

interface GameDataProviderProps {
  children: React.ReactNode;
}

export const GameDataProvider: React.FC<GameDataProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // State
  const [selectedDate, setSelectedDateState] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Player state
  const [selectedPlayers, setSelectedPlayers] = useState<Record<string, GamePlayer | null>>({});
  const [players, setPlayers] = useState<Record<string, GamePlayer[]>>({});
  const [playerLoading, setPlayerLoading] = useState<Record<string, boolean>>({});
  const [playerFetchAttempts, setPlayerFetchAttempts] = useState<Record<string, boolean>>({});

  // Refs for fetch protection
  const isFetchingRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const gamesRef = useRef<Game[]>([]);

  // Track player fetch attempts globally to prevent infinite loops
  const playerFetchAttemptsRef = useRef<Record<string, boolean>>({});

  // Fetch games function
  const fetchGames = useCallback(async (showLoading = false) => {
    console.log(`GameData: fetchGames called with showLoading=${showLoading}, selectedDate=${selectedDate.toDateString()}`);

    // Intelligent fetch protection
    const now = Date.now();
    if (isFetchingRef.current && (now - isFetchingRef.current) < 5000) {
      console.log('GameData: Fetch already in progress, skipping');
      return;
    }

    isFetchingRef.current = now;
    console.log('GameData: Starting fetch, set isFetchingRef to', now);

    try {
      if (showLoading) {
        console.log('GameData: Setting loading to true');
        setLoading(true);
        setError(null);
      }

      const token = await SecureStore.getItemAsync('jwtToken');
      if (!token) {
        console.log('GameData: No auth token');
        if (showLoading) {
          setLoading(false);
        }
        return;
      }

      const localDateStr = selectedDate.getFullYear() + '-' +
        String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(selectedDate.getDate()).padStart(2, '0');

      console.log(`GameData: Making API request for date ${localDateStr}`);
      const response = await axios.get(`${API_BASE_URL}/data/games?date=${localDateStr}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(`GameData: Received response with ${response.data?.length || 0} games`);

      setGames(response.data || []);
      setError(null);

    } catch (err) {
      console.error('GameData: Error in fetchGames:', err);
      setError('Failed to load games');
      setGames([]);
    } finally {
      console.log('GameData: Fetch completed, resetting isFetchingRef and loading');
      isFetchingRef.current = null;
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [selectedDate]);

  // Set selected date (triggers fetch)
  const setSelectedDate = useCallback((date: Date) => {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const currentKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    
    if (dateKey !== currentKey) {
      setSelectedDateState(date);
    }
  }, [selectedDate]);

  // Refresh games manually
  const refreshGames = useCallback(async () => {
    await fetchGames(false);
  }, [fetchGames]);

  // Fetch players for a specific game and team
  const fetchPlayers = useCallback(async (gameId: string, teamId: string) => {
    const key = `${gameId}-${teamId}`;
    if (playerLoading[key] || playerFetchAttemptsRef.current[key]) {
      console.log(`GameData: Already attempted to fetch players for ${key}, skipping`);
      return; // Already loading or already attempted
    }

    console.log(`GameData: Starting to fetch players for ${key}`);
    playerFetchAttemptsRef.current[key] = true;
    setPlayerLoading(prev => ({ ...prev, [key]: true }));

    try {
      const token = await SecureStore.getItemAsync('jwtToken');
      if (!token) {
        console.log('GameData: No auth token, skipping player fetch');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/data/game-players?gameId=${gameId}&teamId=${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000, // 10 second timeout
      });

      console.log(`GameData: Received response for ${key}: ${Array.isArray(response.data) ? response.data.length : 'invalid'} players`);

      // Reset loading state immediately
      setPlayerLoading(prev => ({ ...prev, [key]: false }));

      const newPlayers = Array.isArray(response.data) ? response.data : [];
      setPlayers(prev => {
        const currentPlayers = prev[teamId] || [];
        // Always update the cache, even if it's an empty array
        return { ...prev, [teamId]: newPlayers };
      });
    } catch (err) {
      console.error('GameData: Error fetching players:', err);
      // Ensure loading state is reset even on error
      setPlayerLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  // Handle player selection (save to server)
  const selectPlayer = useCallback(async (gamePlayerId: string) => {
    try {
      const token = await SecureStore.getItemAsync('jwtToken');
      if (!token) return;

      // Find the gamePlayer in cached data to get game and team IDs
      const selectedPlayer = Object.values(players).flat().find(p => p._id === gamePlayerId);
      if (!selectedPlayer) {
        throw new Error('Player not found in cached data');
      }

      const gameId = typeof selectedPlayer.game === 'string' ? selectedPlayer.game : selectedPlayer.game._id;
      // Handle team field that might be a string or Team object
      const teamId = typeof selectedPlayer.team === 'string' ? selectedPlayer.team : selectedPlayer.team._id;

      // Validate IDs are valid MongoDB ObjectIds (24-character hex strings)
      const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);
      
      if (!gameId || !teamId || !isValidObjectId(gameId) || !isValidObjectId(teamId)) {
        throw new Error(`Invalid gameId (${gameId}) or teamId (${teamId}) for player ${gamePlayerId}`);
      }

      console.log('Selecting player:', { gamePlayerId, gameId, teamId });

      const headers = { Authorization: `Bearer ${token}` };

      // Try to create the selection
      try {
        console.log('Creating new selection for gamePlayerId:', gamePlayerId);
        await axios.post(`${API_BASE_URL}/selections`, {
          gamePlayerId
        }, {
          headers,
        });
      } catch (error: any) {
        // If the error is "You already have a selection for this team in this game",
        // find and delete the existing selection, then retry
        if (error.response?.data?.message === 'You already have a selection for this team in this game') {
          console.log('Existing selection found, attempting to delete and retry');

          try {
            // Find the existing selection by fetching all selections and filtering
            console.log('Fetching all user selections to find existing one for game:', gameId, 'team:', teamId);
            const allSelections = await axios.get(`${API_BASE_URL}/selections`, { headers });
            console.log('All selections count:', allSelections.data.length);
            
            // Find the selection for this game and team
            const existingSelection = allSelections.data.find((selection: any) => {
              const selectionGameId = typeof selection.game === 'string' ? selection.game : selection.game._id;
              const selectionTeamId = typeof selection.team === 'string' ? selection.team : selection.team._id;
              return selectionGameId === gameId && selectionTeamId === teamId;
            });
            
            console.log('Found existing selection:', existingSelection ? existingSelection._id : 'none');

            if (existingSelection && existingSelection._id) {
              console.log('Found existing selection to delete:', existingSelection._id);
              // Delete the existing selection
              await axios.delete(`${API_BASE_URL}/selections/${existingSelection._id}`, { headers });

              // Retry creating the new selection
              console.log('Retrying creation of new selection');
              await axios.post(`${API_BASE_URL}/selections`, {
                gamePlayerId
              }, {
                headers,
              });
            } else {
              console.error('No existing selection found in user selections');
              throw new Error('Could not find existing selection to delete');
            }
          } catch (deleteError: any) {
            console.error('Error in delete/retry process:', deleteError);
            if (deleteError.response) {
              console.error('Delete error response:', deleteError.response.data);
            }
            throw error; // Re-throw the original error
          }
        } else {
          // Re-throw other errors
          throw error;
        }
      }

      // Update local state immediately
      setSelectedPlayers(prev => ({
        ...prev,
        [teamId]: selectedPlayer
      }));
    } catch (err) {
      console.error('GameData: Error saving player selection:', err);
      throw err; // Re-throw so components can handle errors
    }
  }, [players]);

  // Fetch selections for all teams in loaded games
  const fetchSelections = useCallback(async () => {
    if (!isAuthenticated || games.length === 0) return;

    try {
      const token = await SecureStore.getItemAsync('jwtToken');
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch selections for all teams in all games
      const selectionPromises = games.flatMap(game => [
        axios.get(`${API_BASE_URL}/selections/${game._id}/${game.awayTeam._id}`, { headers })
          .catch(() => null),
        axios.get(`${API_BASE_URL}/selections/${game._id}/${game.homeTeam._id}`, { headers })
          .catch(() => null),
      ]);

      const selections = await Promise.all(selectionPromises);

      const newSelections: Record<string, GamePlayer | null> = {};

      games.forEach((game, gameIndex) => {
        const awaySelection = selections[gameIndex * 2];
        const homeSelection = selections[gameIndex * 2 + 1];

        if (awaySelection?.data?.gamePlayer) {
          newSelections[game.awayTeam._id] = awaySelection.data.gamePlayer;
        }

        if (homeSelection?.data?.gamePlayer) {
          newSelections[game.homeTeam._id] = homeSelection.data.gamePlayer;
        }
      });

      setSelectedPlayers(newSelections);
    } catch (error) {
      console.error('GameData: Error fetching selections:', error);
    }
  }, [games, isAuthenticated]);

  // Initial fetch and date change effect
  useEffect(() => {
    console.log('GameData: Date changed, fetching games');
    fetchGames(true);
  }, [selectedDate, fetchGames]);

  // Fetch selections when games change
  useEffect(() => {
    // Only fetch if games actually changed (not just reference)
    const gamesChanged = games.length !== gamesRef.current.length || 
      !games.every((game, index) => game._id === gamesRef.current[index]?._id);
    
    if (gamesChanged && games.length > 0) {
      gamesRef.current = [...games];
      fetchSelections();
    }
  }, [games, fetchSelections]);

  // Start/stop periodic refresh
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startPeriodicRefresh = () => {
      // Refresh every 2 minutes (120000 ms)
      intervalId = setInterval(async () => {
        if (mountedRef.current && isAuthenticated && games.length > 0) {
          console.log('GameData: Periodic refresh triggered');
          await fetchGames(false); // Don't reset loading state for periodic refreshes
          await fetchSelections(); // Also refresh selections
        }
      }, 120000); // 2 minutes
    };

    const stopPeriodicRefresh = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Start periodic refresh when authenticated and have games
    if (isAuthenticated && games.length > 0) {
      startPeriodicRefresh();
    }

    return () => {
      stopPeriodicRefresh();
      // Don't set mountedRef to false here - it should only be false when context unmounts
    };
  }, [isAuthenticated, games.length, fetchGames]);

  // Context cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Manual refresh function
  const refreshAllData = useCallback(async () => {
    console.log('GameData: Manual refresh triggered');
    await fetchGames(false);
    if (games.length > 0) {
      await fetchSelections();
    }
  }, [fetchGames, games.length, fetchSelections]);

  // Reset player fetch attempt (for retry functionality)
  const resetPlayerFetchAttempt = useCallback((gameId: string, teamId: string) => {
    const key = `${gameId}-${teamId}`;
    playerFetchAttemptsRef.current[key] = false;
  }, []);

  const value: GameDataContextType = {
    selectedDate,
    games,
    loading,
    error,
    selectedPlayers,
    players,
    playerLoading,
    playerFetchAttempts: playerFetchAttemptsRef.current,
    setSelectedDate,
    refreshGames,
    refreshAllData,
    selectPlayer,
    fetchPlayers,
    resetPlayerFetchAttempt,
  };

  return (
    <GameDataContext.Provider value={value}>
      {children}
    </GameDataContext.Provider>
  );
};