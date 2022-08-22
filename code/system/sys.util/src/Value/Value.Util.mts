/**
 * Determines whether an HTTP status is OK.
 */
export const isStatusOk = (status: number) => {
  return status === undefined ? false : status.toString().startsWith('2');
};

/**
 * A singular/plural display string.
 */
export function plural(count: number, singular: string, plural?: string) {
  plural = plural ? plural : `${singular}s`;
  return count === 1 || count === -1 ? singular : plural;
}
