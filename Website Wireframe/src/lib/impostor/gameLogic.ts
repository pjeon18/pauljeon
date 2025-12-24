import { getCategoryById, impostorCategories } from './categories';

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 12;
export const DEFAULT_CATEGORY_ID = impostorCategories[0]?.id ?? 'brands';

export type GameSession = {
  playerCount: number;
  categoryId: string;
  categoryName: string;
  word: string;
  impostorIndex: number;
};

const pickRandomWord = (categoryId: string) => {
  const category = getCategoryById(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }
  const word = category.words[Math.floor(Math.random() * category.words.length)];
  return { word, categoryName: category.name };
};

const pickImpostorIndex = (playerCount: number) => {
  return Math.floor(Math.random() * playerCount);
};

export const createGameSession = async (
  playerCount: number,
  categoryId: string
): Promise<GameSession> => {
  if (playerCount < MIN_PLAYERS || playerCount > MAX_PLAYERS) {
    throw new Error(`Player count must be between ${MIN_PLAYERS} and ${MAX_PLAYERS}`);
  }

  const { word, categoryName } = pickRandomWord(categoryId);
  const impostorIndex = pickImpostorIndex(playerCount);

  return {
    playerCount,
    categoryId,
    categoryName,
    word,
    impostorIndex,
  };
};

export const getRoleForPlayer = (session: GameSession, index: number) =>
  index === session.impostorIndex ? 'impostor' : 'innocent';

