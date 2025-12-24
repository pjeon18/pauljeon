import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { SetupPanel } from '@/components/games/impostor/SetupPanel';
import { RevealPanel } from '@/components/games/impostor/RevealPanel';
import {
  DEFAULT_CATEGORY_ID,
  MAX_PLAYERS,
  MIN_PLAYERS,
  createGameSession,
  type GameSession,
} from '@/lib/impostor/gameLogic';
import { impostorCategories } from '@/lib/impostor/categories';

type Phase = 'setup' | 'reveal' | 'complete';

type PersistedState = {
  session: GameSession | null;
  phase: Phase;
  currentPlayer: number;
  isShowingRole: boolean;
  playerCount: number;
  categoryId: string;
};

const STORAGE_KEY = 'impostor-game-state';

const loadPersistedState = (): PersistedState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
};

const persistState = (state: PersistedState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
};

export default function ImpostorGamePage() {
  const [playerCount, setPlayerCount] = useState(6);
  const [categoryId, setCategoryId] = useState(DEFAULT_CATEGORY_ID);
  const [session, setSession] = useState<GameSession | null>(null);
  const [phase, setPhase] = useState<Phase>('setup');
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [isShowingRole, setIsShowingRole] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [wordsVisible, setWordsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const restored = loadPersistedState();
    if (restored) {
      setSession(restored.session);
      setPhase(restored.phase);
      setCurrentPlayer(restored.currentPlayer);
      setIsShowingRole(restored.isShowingRole);
      setPlayerCount(restored.playerCount);
      setCategoryId(restored.categoryId);
    }
  }, []);

  useEffect(() => {
    persistState({
      session,
      phase,
      currentPlayer,
      isShowingRole,
      playerCount,
      categoryId,
    });
  }, [session, phase, currentPlayer, isShowingRole, playerCount, categoryId]);

  const categoryName = useMemo(
    () => impostorCategories.find((c) => c.id === categoryId)?.name ?? 'Category',
    [categoryId]
  );

  const handleStartGame = async () => {
    setError(null);
    setIsStarting(true);
    try {
      const newSession = await createGameSession(playerCount, categoryId);
      setSession(newSession);
      setPhase('reveal');
      setCurrentPlayer(0);
      setIsShowingRole(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start game.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleShowRole = () => setIsShowingRole(true);

  const handleContinue = () => {
    if (!session) return;
    const isLast = currentPlayer >= session.playerCount - 1;
    if (isLast) {
      setPhase('complete');
      setIsShowingRole(false);
    } else {
      setCurrentPlayer((prev) => prev + 1);
      setIsShowingRole(false);
    }
  };

  const handleStartOver = () => {
    const confirmed = window.confirm('Start over and return to setup? Current progress will reset.');
    if (!confirmed) return;
    setSession(null);
    setPhase('setup');
    setCurrentPlayer(0);
    setIsShowingRole(false);
  };

  const handleRestart = () => {
    setSession(null);
    setPhase('setup');
    setCurrentPlayer(0);
    setIsShowingRole(false);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen px-8 lg:px-16 py-28">
        <div className="w-full max-w-[1200px] mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <p className="text-sm tracking-widest text-gray-500">IMPOSTOR</p>
            <h1 className="text-5xl lg:text-6xl font-semibold">Impostor</h1>
            <p className="text-lg text-gray-600">
              Pass the device around. Reveal roles one at a time. Find the impostor.
            </p>
          </motion.div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <SetupPanel
              playerCount={playerCount}
              categoryId={categoryId}
              onPlayerChange={(value) => setPlayerCount(Math.min(Math.max(value, MIN_PLAYERS), MAX_PLAYERS))}
              onCategoryChange={setCategoryId}
              onStart={handleStartGame}
              onViewWords={() => setWordsVisible((prev) => !prev)}
              disabled={isStarting}
            />

            <div className="space-y-4">
              {session && (
                <RevealPanel
                  session={session}
                  currentPlayer={currentPlayer}
                  isShowingRole={isShowingRole}
                  phase={phase}
                  onShowRole={handleShowRole}
                  onContinue={handleContinue}
                  onStartOver={handleStartOver}
                  onRestart={handleRestart}
                />
              )}

              {!session && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-gray-600"
                >
                  <p className="text-sm font-semibold text-gray-800 mb-2">Waiting to start</p>
                  <p className="leading-relaxed">
                    Choose your player count and category, then hit Start Game. Roles will be revealed one at a time.
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {wordsVisible && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Category word lists</h3>
                  <p className="text-sm text-gray-600">
                    Preview the words players might see. Current category: {categoryName}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWordsVisible(false)}
                  className="text-sm font-semibold text-gray-700 underline underline-offset-4 hover:opacity-80 transition"
                >
                  Close
                </button>
              </div>
              <div className="space-y-6 max-h-[420px] overflow-y-auto pr-1">
                {impostorCategories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold">{category.name}</h4>
                      <span className="text-xs text-gray-500">{category.words.length} words</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.words.map((word) => (
                        <span
                          key={word}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}

