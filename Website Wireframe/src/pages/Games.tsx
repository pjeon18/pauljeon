import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { GameCard } from '@/components/games/GameCard';

export default function GamesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen px-8 lg:px-16 py-32">
        <div className="w-full max-w-[1200px] mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <p className="text-sm tracking-widest text-gray-500">GAMES</p>
            <h1 className="text-5xl lg:text-6xl font-semibold">Games</h1>
            <p className="text-lg text-gray-600">Pick a game to play.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <GameCard
              title="Impostor"
              description="Pass the device around, reveal roles one by one, and find the impostor."
              to="/games/impostor"
            />
            <GameCard
              title="Coming Soon..."
              description="New party game in progress. Stay tuned."
              disabled
              badge="Coming Soon"
            />
            <GameCard
              title="Coming Soon..."
              description="A fresh strategy challenge is on the way."
              disabled
              badge="Coming Soon"
            />
            <GameCard
              title="Coming Soon..."
              description="Another social game is brewing."
              disabled
              badge="Coming Soon"
            />
          </motion.div>
        </div>
      </main>
    </>
  );
}

