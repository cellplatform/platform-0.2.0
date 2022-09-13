import { VercelHttp as Http } from './Vercel.Http/index.mjs';
import { VercelFs as Fs } from './Vercel.Fs.mjs';
import { VercelDeploy as Deploy } from './Vercel.Deploy.mjs';
import { VercelInfo as Info } from './Vercel.Info.mjs';

export const Vercel = {
  Fs,
  Http,
  Deploy,
  Info,
};
