export function fields<T extends string>(
  input: (T | undefined | null)[] | undefined,
  defaults?: T[],
): T[] {
  return (input ?? defaults ?? []).filter(Boolean) as T[];
}
