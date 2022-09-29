export {};

import { Pkg } from './index.pkg.mjs';
console.info(`Pkg:`, Pkg);

import('./ui/entry');
import('./main/entry.mjs');
