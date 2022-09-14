import { VercelBus as Bus } from '../Vercel.Bus/index.mjs';
import { client } from './Vercel.client.mjs';
import { VercelFs as Fs } from './Vercel.Fs.mjs';
import { VercelHttp as Http } from './Vercel.Http/index.mjs';
import { VercelInfo as Info } from './Vercel.Info.mjs';
import { VercelLog as Log } from './Vercel.Log.mjs';

export const Vercel = {
  Bus,
  Fs,
  Http,
  Info,
  Log,
  client,
};
