import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type GameCardProps = {
  title: string;
  description: string;
  to?: string;
  disabled?: boolean;
  badge?: string;
};

export function GameCard({ title, description, to, disabled, badge }: GameCardProps) {
  const hoverMotion = disabled ? { y: -2, scale: 1.005 } : { y: -4, scale: 1.01 };

  const card = (
    <motion.div
      whileHover={hoverMotion}
      transition={{ duration: 0.18 }}
      className={`group relative h-full rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 ${
        disabled
          ? 'opacity-90 cursor-not-allowed hover:shadow-md hover:border-gray-300'
          : 'hover:shadow-lg hover:border-black cursor-pointer'
      }`}
    >
      <div className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-semibold">{title}</h3>
          {badge && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold tracking-wide text-gray-700">
              {badge}
            </span>
          )}
        </div>
        <p className="text-gray-600 flex-1 leading-relaxed">{description}</p>
        {!disabled && (
          <div className="flex items-center text-sm font-medium text-gray-800">
            <span className="transition-transform duration-200 group-hover:translate-x-1">Play</span>
            <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (disabled || !to) {
    return card;
  }

  return (
    <Link to={to} className="block h-full">
      {card}
    </Link>
  );
}

