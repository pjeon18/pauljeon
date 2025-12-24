import { motion } from 'framer-motion';
import { impostorCategories, type ImpostorCategory } from '@/lib/impostor/categories';
import { MAX_PLAYERS, MIN_PLAYERS } from '@/lib/impostor/gameLogic';

type SetupPanelProps = {
  playerCount: number;
  categoryId: string;
  onPlayerChange: (value: number) => void;
  onCategoryChange: (id: string) => void;
  onStart: () => void;
  onViewWords: () => void;
  disabled?: boolean;
};

export function SetupPanel({
  playerCount,
  categoryId,
  onPlayerChange,
  onCategoryChange,
  onStart,
  onViewWords,
  disabled,
}: SetupPanelProps) {
  const isStartDisabled = disabled || playerCount < MIN_PLAYERS || playerCount > MAX_PLAYERS || !categoryId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm tracking-widest text-gray-500 mb-2">SETUP</p>
          <h2 className="text-3xl font-semibold">Configure the game</h2>
          <p className="text-gray-600 mt-2">
            Choose how many players are joining and which category to play. Start when you&apos;re ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-800">Number of players</span>
            <input
              type="number"
              min={MIN_PLAYERS}
              max={MAX_PLAYERS}
              value={playerCount}
              onChange={(e) => onPlayerChange(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-black focus:outline-none"
            />
            <span className="text-xs text-gray-500">
              {MIN_PLAYERS}–{MAX_PLAYERS} players. Exactly one will be the impostor.
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-800">Category</span>
            <select
              value={categoryId}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-black focus:outline-none"
            >
              {impostorCategories.map((category: ImpostorCategory) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onViewWords}
              className="text-sm font-medium text-gray-800 underline underline-offset-4 hover:opacity-80 transition-opacity text-left"
            >
              View words
            </button>
          </label>
        </div>

        <button
          type="button"
          onClick={onStart}
          disabled={isStartDisabled}
          className={`rounded-lg px-5 py-3 text-sm font-semibold transition ${
            isStartDisabled
              ? 'cursor-not-allowed bg-gray-200 text-gray-500'
              : 'bg-black text-white hover:bg-gray-900'
          }`}
        >
          Start Game
        </button>
      </div>
    </motion.div>
  );
}

