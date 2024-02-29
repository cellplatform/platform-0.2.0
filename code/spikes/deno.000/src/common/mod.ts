export type * as t from '../types.ts';
export * from './libs.ts';

export { EnvVars } from '../env.ts';

/**
 * Helpers
 */
export function statusOK(input: number | Response) {
  const status = typeof input === 'number' ? input : input.status;
  return (status || 0).toString().startsWith('2');
}
