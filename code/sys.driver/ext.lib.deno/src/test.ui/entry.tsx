import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Pkg } from '../index.pkg';
import { Dev } from 'sys.ui.react.common';

(async () => {
  console.info(`Pkg:`, Pkg);
  const { Specs } = await import('./entry.Specs');

  const env = { accessToken: 'sample.6sd54fs6d5fsd32f1s3d2f1s354es2d1f3se21' }; // sample 🐷

  const el = await Dev.render(Pkg, Specs, { hrDepth: 3 });
  const root = createRoot(document.getElementById('root')!);
  root.render(<StrictMode>{el}</StrictMode>);
})();
