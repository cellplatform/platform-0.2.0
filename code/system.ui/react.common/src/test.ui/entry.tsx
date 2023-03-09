import 'symbol-observable';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Pkg } from '../index.pkg.mjs';
import { Dev } from '../ui.dev';
const { All } = await import('./entry.Specs.mjs');

const el = await Dev.render(Pkg, All, { hrDepth: 3 });
const root = createRoot(document.getElementById('root')!);
root.render(<StrictMode>{el}</StrictMode>);
console.info(`Pkg:`, Pkg);
