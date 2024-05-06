export * from '../../../deno/u.ts';
export type * as t from './t.ts';

import { dotenv } from '../../../deno/u.ts';
export const env = await dotenv.load();
