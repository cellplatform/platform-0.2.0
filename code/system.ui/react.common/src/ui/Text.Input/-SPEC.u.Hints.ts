const HINTS = [
  'cartography',
  'catamaran',
  'sovereign',
  'soul',
  'hellacious',
  'helpful',
  'heretofore',
].sort();

export const Hints = {
  lookup(value: string) {
    const hint = HINTS.find((item) => item.startsWith(value.toLowerCase()));
    return hint ? hint.substring(value.length) : undefined;
  },
};
