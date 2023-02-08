import 'symbol-observable';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Pkg } from '../index.pkg.mjs';
import { Dev } from '../ui.dev/Dev.mjs';

const { Specs, DevSpecs } = await import('./entry.Specs.mjs');

console.info(`Pkg:`, Pkg);
const root = createRoot(document.getElementById('root')!);
const el = await Dev.render(Pkg, { ...Specs, ...DevSpecs }, { hrDepth: 3 });
root.render(<StrictMode>{el}</StrictMode>);
