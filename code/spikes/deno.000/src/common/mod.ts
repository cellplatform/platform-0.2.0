export type * as t from '../types.ts';
export * from './libs.ts';

export { Env } from '../env.ts';

export const Http = {
  statusOK(input: number | Response) {
    const status = typeof input === 'number' ? input : input.status;
    return (status || 0).toString().startsWith('2');
  },
} as const;
