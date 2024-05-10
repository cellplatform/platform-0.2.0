export * from '../../../deno/common/u.ts';
export type * as t from './t.ts';

import { dotenv } from '../../../deno/common/u.ts';
export const env = await dotenv.load();
