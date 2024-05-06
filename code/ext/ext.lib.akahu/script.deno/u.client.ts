import { AkahuClient } from 'npm:akahu';
import { env } from './u.ts';

const appToken = env['AKAHU_APP_TOKEN'];
export const userToken = env['AKAHU_USER_TOKEN'];
export const akahu = new AkahuClient({ appToken });
export const client = akahu;
