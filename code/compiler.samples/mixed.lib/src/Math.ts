export const Math = {
  sum: (...items: number[]) => items.reduce((acc, item) => acc + item, 0),
} as const;
