import Pkg from '../../package.json' assert { type: 'json' };
import { HttpResponse } from '../common.js';
export const runtime = 'edge';

export async function GET(request: Request) {
  const { name, version } = Pkg as { name: string; version: string };
  return HttpResponse.json(200, { name, version });
}
