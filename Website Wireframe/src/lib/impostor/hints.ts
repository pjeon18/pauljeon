type HintParams = {
  word: string;
  category: string;
  aiEnabled: boolean;
  endpoint?: string;
};

const templates = [
  (word: string, category: string) =>
    `Think of a ${category.toLowerCase()} that starts with "${word[0].toUpperCase()}" and has ${word.length} letters.`,
  (word: string, category: string) =>
    `A well-known ${category.toLowerCase()} with ${word.length} letters; its first letter is "${word[0].toUpperCase()}".`,
  (word: string, category: string) =>
    `Consider a popular ${category.toLowerCase()} beginning with "${word[0].toUpperCase()}" — count ${word.length} letters in total.`,
  (word: string, category: string) =>
    `This ${category.toLowerCase()} is widely recognized and starts with "${word[0].toUpperCase()}".`,
];

export const generateLocalHint = (word: string, category: string) => {
  const safeCategory = category || 'item';
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template(word, safeCategory);
};

export const fetchHint = async ({ word, category, aiEnabled, endpoint }: HintParams) => {
  if (aiEnabled && endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, category }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.hint && typeof data.hint === 'string') {
          return data.hint;
        }
      }
    } catch (error) {
      console.warn('AI hint request failed, falling back to local hint.', error);
    }
  }

  return generateLocalHint(word, category);
};

