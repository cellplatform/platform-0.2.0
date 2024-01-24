export type FuncParams = {};
export type FuncResponse = unknown;

/**
 * (ƒ) A runnable async function.
 *
 *   Either takes an ƒ({object}) parameter, or no params.
 *   Response with a async promise.
 */
export type Func<R extends FuncResponse, P extends FuncParams> = [P] extends [never]
  ? () => Promise<R>
  : (args: P) => Promise<R>;
