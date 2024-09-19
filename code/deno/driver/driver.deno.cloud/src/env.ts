import { DotEnv } from './u.Server/mod.ts';

const values = await DotEnv.load();
const id = values['PRIVY_APP_ID'] ?? '';
const secret = values['PRIVY_APP_SECRET'] ?? '';
const privy = { id, secret };

export const env = { privy };
