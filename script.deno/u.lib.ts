import { expandGlob } from 'https://deno.land/std@0.224.0/fs/mod.ts';
import { join, dirname, fromFileUrl, resolve } from 'https://deno.land/std@0.224.0/path/mod.ts';

export const Path = { join, dirname, fromFileUrl, resolve } as const;
export const Fs = { expandGlob } as const;
