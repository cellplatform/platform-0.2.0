/**
 * A singular/plural display string.
 */
export function plural(count: number, singular: string, plural?: string) {
  plural = plural ? plural : `${singular}s`;
  return count === 1 || count === -1 ? singular : plural;
}
