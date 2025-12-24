import { motion } from 'framer-motion';
import { GameSession, getRoleForPlayer } from '@/lib/impostor/gameLogic';

type RevealPanelProps = {
  session: GameSession;
  currentPlayer: number;
  isShowingRole: boolean;
  phase: 'reveal' | 'complete';
  onShowRole: () => void;
  onContinue: () => void;
  onStartOver: () => void;
  onRestart: () => void;
};

export function RevealPanel({
  session,
  currentPlayer,
  isShowingRole,
  phase,
  onShowRole,
  onContinue,
  onStartOver,
  onRestart,
}: RevealPanelProps) {
  const role = getRoleForPlayer(session, currentPlayer);
  const progressLabel =
    phase === 'complete'
      ? `Reveal ${session.playerCount} of ${session.playerCount}`
      : `Reveal ${currentPlayer + 1} of ${session.playerCount}`;

  if (phase === 'complete') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm"
      >
        <p className="text-sm tracking-widest text-gray-500 mb-2">{progressLabel}</p>
        <h2 className="text-3xl font-semibold mb-4">All roles assigned. Start discussing!</h2>
        <p className="text-gray-600 mb-8">
          Everyone has seen their role. Keep your poker face on, and find the impostor.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
          >
            Restart Game
          </button>
          <button
            type="button"
            onClick={onStartOver}
            className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-black"
          >
            Start Over
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`${currentPlayer}-${isShowingRole ? 'show' : 'hidden'}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm"
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm tracking-widest text-gray-500">{progressLabel}</p>
          <button
            type="button"
            onClick={onStartOver}
            className="text-sm font-semibold text-gray-700 underline underline-offset-4 hover:opacity-80 transition"
          >
            Start Over
          </button>
        </div>

        {!isShowingRole ? (
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Player {currentPlayer + 1}, get ready.</h2>
            <p className="text-gray-600">Pass the device. Only tap when you are the right player.</p>
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={onShowRole}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
            >
              Show Role
            </motion.button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-500">Your role</p>
              <h2
                className={`text-4xl font-bold ${
                  role === 'impostor' ? 'text-red-600' : 'text-emerald-600'
                }`}
              >
                {role === 'impostor' ? 'IMPOSTOR' : 'INNOCENT'}
              </h2>
            </div>

            {role === 'impostor' ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-500">Instructions</p>
                <p className="text-lg leading-relaxed text-gray-800">
                  You are the impostor. Keep a poker face and avoid giving yourself away.
                </p>
                <p className="text-xs text-gray-500">No hint provided—blend in and bluff.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-500">Secret word</p>
                <p className="text-lg leading-relaxed text-gray-900">{session.word}</p>
              </div>
            )}

            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={onContinue}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-black"
            >
              Continue
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

