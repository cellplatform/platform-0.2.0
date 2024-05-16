type O = Record<string, unknown>;

/**
 * A singular/plural display string.
 */
export function plural(count: number, singular: string, plural?: string) {
  plural = plural ? plural : `${singular}s`;
  return count === 1 || count === -1 ? singular : plural;
}

/**
 * Toggle the value of a boolean {object} key.
 * WARNING:
 *    This manipulates the given object.
 *    Ensure an immutable-safe object is passed.
 */
export function toggle<T extends O | any[]>(
  mutate: T,
  key: T extends any[] ? number : keyof T,
): boolean {
  if (mutate === null) return false;
  if (typeof mutate !== 'object') return false;

  const current = (mutate as any)[key];
  if (typeof current !== 'boolean' && current !== undefined) return false;

  const next = current === undefined ? true : !current;
  (mutate as any)[key] = next as T extends any[] ? T[number] : T[keyof T];
  return next;
}
