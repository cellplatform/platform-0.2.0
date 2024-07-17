/**
 * Pick optional fields from a type converting them to required.
 * Example:
 *
 *    const props: PickRequired<T, 'total'> = {
 *      total: 5,
 *    };
 */
export type PickRequired<T, K extends keyof T> = {
  [P in K]-?: T[P];
};
