import axios from 'axios';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { API_BASE_URL } from '../constants/api';
import { Game, GamePlayer } from '../constants/interfaces';
import { useAuth } from '../providers/AuthProvider';
import { storageService } from '../utils/storage';

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

  // Consolidated refs for proper cleanup and memory management
  const refs = useRef({
    isFetching: null as number | null,
    mounted: true,
    games: [] as Game[],
    playerFetchAttempts: {} as Record<string, boolean>,
    abortController: null as AbortController | null,
    playerAbortController: null as AbortController | null,
    selectionAbortController: null as AbortController | null,
    selectionsAbortController: null as AbortController | null,
  });

  // Fetch games function
  const fetchGames = useCallback(async (showLoading = false) => {

    // Intelligent fetch protection
    const now = Date.now();
    if (refs.current.isFetching && (now - refs.current.isFetching) < 5000) {
      return;
    }

    // Cancel any existing request
    if (refs.current.abortController) {
      refs.current.abortController.abort();
    }

    // Create new abort controller for this request
    refs.current.abortController = new AbortController();
    refs.current.isFetching = now;

    try {
      if (showLoading) {
        setLoading(true);
        setError(null);
      }

      const token = await storageService.getItem('jwtToken');
      if (!token) {
        if (showLoading) {
          setLoading(false);
        }
        return;
      }

      const localDateStr = selectedDate.getFullYear() + '-' +
        String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(selectedDate.getDate()).padStart(2, '0');

      const response = await axios.get(`${API_BASE_URL}/data/games?date=${localDateStr}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: refs.current.abortController.signal,
      });


      setGames(response.data || []);
      setError(null);

    } catch (err) {
      setError('Failed to load games');
      setGames([]);
    } finally {
      refs.current.isFetching = null;
      refs.current.abortController = null;
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
      // Clear player data when date changes
      setPlayers({});
      setPlayerLoading({});
      setPlayerFetchAttempts({});
      setSelectedPlayers({});
      setError(null);
      // Clear refs
      refs.current.playerFetchAttempts = {};
    }
  }, [selectedDate]);

  // Refresh games manually
  const refreshGames = useCallback(async () => {
    await fetchGames(false);
  }, [fetchGames]);

  // Fetch players for a specific game and team
  const fetchPlayers = useCallback(async (gameId: string, teamId: string) => {
    const key = `${gameId}-${teamId}`;
    if (playerLoading[key] || refs.current.playerFetchAttempts[key]) {
      return; // Already loading or already attempted
    }

    refs.current.playerFetchAttempts[key] = true;
    setPlayerLoading(prev => ({ ...prev, [key]: true }));

    try {
      const token = await storageService.getItem('jwtToken');
      if (!token) {
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/data/game-players?gameId=${gameId}&teamId=${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000, // 10 second timeout
      });

      // Reset loading state immediately
      setPlayerLoading(prev => ({ ...prev, [key]: false }));

      const newPlayers = Array.isArray(response.data) ? response.data : [];
      
      setPlayers(prev => {
        // Always update the cache, even if it's an empty array
        return { ...prev, [teamId]: newPlayers };
      });
    } catch (err) {
      // Ensure loading state is reset even on error
      setPlayerLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  // Handle player selection (save to server)
  const selectPlayer = useCallback(async (gamePlayerId: string) => {
    // Cancel any existing selection request
    if (refs.current.selectionAbortController) {
      refs.current.selectionAbortController.abort();
    }

    // Create new abort controller for this selection request
    refs.current.selectionAbortController = new AbortController();

    try {
      const token = await storageService.getItem('jwtToken');
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


      const headers = { Authorization: `Bearer ${token}` };

      // Try to create the selection
      try {
        await axios.post(`${API_BASE_URL}/selections`, {
          gamePlayerId
        }, {
          headers,
          signal: refs.current.selectionAbortController.signal,
        });
      } catch (error: any) {
        // If the error is "You already have a selection for this team in this game",
        // find and delete the existing selection, then retry
        if (error.response?.data?.message === 'You already have a selection for this team in this game') {

          try {
            // Find the existing selection by fetching all selections and filtering
            const allSelections = await axios.get(`${API_BASE_URL}/selections`, { 
              headers,
              signal: refs.current.selectionAbortController.signal,
            });
            
            // Find the selection for this game and team
            const existingSelection = allSelections.data.find((selection: any) => {
              const selectionGameId = typeof selection.game === 'string' ? selection.game : selection.game._id;
              const selectionTeamId = typeof selection.team === 'string' ? selection.team : selection.team._id;
              return selectionGameId === gameId && selectionTeamId === teamId;
            });
            

            if (existingSelection && existingSelection._id) {
              // Delete the existing selection
              await axios.delete(`${API_BASE_URL}/selections/${existingSelection._id}`, { 
                headers,
                signal: refs.current.selectionAbortController.signal,
              });

              // Retry creating the new selection
              await axios.post(`${API_BASE_URL}/selections`, {
                gamePlayerId
              }, {
                headers,
                signal: refs.current.selectionAbortController.signal,
              });
            } else {
              throw new Error('Could not find existing selection to delete');
            }
          } catch (deleteError: any) {
            if (deleteError.response) {
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
      refs.current.selectionAbortController = null;
      throw err; // Re-throw so components can handle errors
    }
  }, [players]);

  // Fetch selections for all teams in loaded games
  const fetchSelections = useCallback(async () => {
    if (!isAuthenticated || games.length === 0) return;

    // Cancel any existing selections request
    if (refs.current.selectionsAbortController) {
      refs.current.selectionsAbortController.abort();
    }

    // Create new abort controller for this selections request
    refs.current.selectionsAbortController = new AbortController();

    try {
      const token = await storageService.getItem('jwtToken');
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch selections for all teams in all games
      const selectionPromises = games.flatMap(game => [
        axios.get(`${API_BASE_URL}/selections/${game._id}/${game.awayTeam._id}`, { 
          headers,
          signal: refs.current.selectionsAbortController?.signal,
        })
          .catch(() => null),
        axios.get(`${API_BASE_URL}/selections/${game._id}/${game.homeTeam._id}`, { 
          headers,
          signal: refs.current.selectionsAbortController?.signal,
        })
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
      refs.current.selectionsAbortController = null;
    }
  }, [games, isAuthenticated]);

  // Initial fetch and date change effect
  useEffect(() => {
    fetchGames(true);
  }, [selectedDate, fetchGames]);

  // Fetch selections when games change
  useEffect(() => {
    // Only fetch if games actually changed (not just reference)
    const gamesChanged = games.length !== refs.current.games.length || 
      !games.every((game, index) => game._id === refs.current.games[index]?._id);
    
    if (gamesChanged && games.length > 0) {
      refs.current.games = [...games];
      fetchSelections();
    }
  }, [games, fetchSelections]);

  // Start/stop periodic refresh
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startPeriodicRefresh = () => {
      // Refresh every 2 minutes (120000 ms)
      intervalId = setInterval(async () => {
        if (refs.current.mounted && isAuthenticated && games.length > 0) {
          await fetchGames(false); // Don't reset loading state for periodic refreshs
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
      // Don't set refs.current.mounted to false here - it should only be false when context unmounts
    };
  }, [isAuthenticated, games.length, fetchGames]);

  // Context cleanup
  useEffect(() => {
    return () => {
      refs.current.mounted = false;
    };
  }, []);

  // Manual refresh function
  const refreshAllData = useCallback(async () => {
    await fetchGames(false);
    if (games.length > 0) {
      await fetchSelections();
    }
  }, [fetchGames, games.length, fetchSelections]);

  // Reset player fetch attempt (for retry functionality)
  const resetPlayerFetchAttempt = useCallback((gameId: string, teamId: string) => {
    const key = `${gameId}-${teamId}`;
    refs.current.playerFetchAttempts[key] = false;
  }, []);

  const value: GameDataContextType = useMemo(() => ({
    selectedDate,
    games,
    loading,
    error,
    selectedPlayers,
    players,
    playerLoading,
    playerFetchAttempts: refs.current.playerFetchAttempts,
    setSelectedDate,
    refreshGames,
    refreshAllData,
    selectPlayer,
    fetchPlayers,
    resetPlayerFetchAttempt,
  }), [
    selectedDate,
    games,
    loading,
    error,
    selectedPlayers,
    players,
    playerLoading,
    setSelectedDate,
    refreshGames,
    refreshAllData,
    selectPlayer,
    fetchPlayers,
    resetPlayerFetchAttempt,
  ]);

  return (
    <GameDataContext.Provider value={value}>
      {children}
    </GameDataContext.Provider>
  );
};