import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Pkg } from '../index.pkg';
import { Dev } from 'sys.ui.react.common';

(async () => {
  console.info(`Pkg:`, Pkg);
  const { Specs } = await import('./entry.Specs');

  const el = await Dev.render(Pkg, Specs, { hrDepth: 3 });
  const root = createRoot(document.getElementById('root')!);
  root.render(<StrictMode>{el}</StrictMode>);
})();
