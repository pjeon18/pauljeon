import { useEffect, useMemo, useState } from 'react';

type GridCell = {
  id: number;
  lockAt: number;
};

type CellState = {
  color: string;
  opacity: number;
  locked: boolean;
};

const palette = ['#0b0d10', '#111111', '#1a1a1a', '#2a2a2a', '#3a3a3a', '#4a4a4a', '#5a5a5a', '#6a6a6a', '#7a7a7a', '#8a8a8a', '#9a9a9a', '#b0b0b0', '#d0d0d0', '#f5f5f5', '#ffffff'];

/**
 * Fullscreen loading mask that starts as dense pixelated noise (grayscale)
 * and gradually resolves/vanishes, revealing the page as if it's de-pixelating.
 */
export function EntryGridMask() {
  const [cellStates, setCellStates] = useState<Record<number, CellState>>({});
  const [isFading, setIsFading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const rows = 18;
  const cols = 28;

  const cells = useMemo<GridCell[]>(() => {
    const list: GridCell[] = [];
    const baseLock = 1200;
    const lockSpread = 1600;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        list.push({
          id: r * cols + c,
          lockAt: baseLock + Math.random() * lockSpread,
        });
      }
    }
    return list;
  }, [rows, cols]);

  useEffect(() => {
    // Initial random grayscale colors, full opacity
    setCellStates(
      cells.reduce<Record<number, CellState>>((acc, cell) => {
        acc[cell.id] = {
          color: palette[Math.floor(Math.random() * palette.length)],
          opacity: 1,
          locked: false,
        };
        return acc;
      }, {})
    );

    // Staggered "stabilize" where squares fade out to reveal page
    const lockTimers = cells.map((cell) =>
      setTimeout(() => {
        setCellStates((prev) => ({
          ...prev,
          [cell.id]: { color: prev[cell.id]?.color ?? '#0b0d10', opacity: 0, locked: true },
        }));
      }, cell.lockAt)
    );

    // Fade overlay container after most squares are gone
    const fadeAfter = Math.max(...cells.map((c) => c.lockAt)) + 400;
    const fadeOut = setTimeout(() => setIsFading(true), fadeAfter);
    const hide = setTimeout(() => setIsHidden(true), fadeAfter + 700);

    return () => {
      lockTimers.forEach(clearTimeout);
      clearTimeout(fadeOut);
      clearTimeout(hide);
    };
  }, [cells]);

  if (isHidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[80] pointer-events-auto transition-opacity duration-700 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#0b0d10' }}
      aria-hidden
    >
      <div
        className="w-full h-full grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cells.map((cell) => {
          const state = cellStates[cell.id];
          return (
            <span
              key={cell.id}
              className="w-full h-full transition-all"
              style={{
                transitionDuration: '420ms',
                backgroundColor: state?.color ?? '#0b0d10',
                opacity: state?.opacity ?? 1,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

