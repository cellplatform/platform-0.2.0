/**
 * Deletes undefined keys from an object (clone).
 */
// export function deleteUndefined<T extends Record<string, unknown>>(obj: T) {
//   obj = { ...(obj as any) };
//   Object.keys(obj)
//     .filter((key) => obj[key] === undefined)
//     .forEach((key) => delete obj[key]);
//   return obj;
// }

/**
 * Deletes empty keys from an object (clone).
 */
// export function deleteEmpty<T extends Record<string, unknown>>(obj: T) {
//   obj = { ...(obj as any) };
//   Object.keys(obj)
//     .filter((key) => obj[key] === undefined || obj[key] === '')
//     .forEach((key) => delete obj[key]);
//   return obj;
// }

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
